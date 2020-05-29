var Agents = function (ctx, xSpan, ySpan, gridGap, populationCount, target, mutationRate) {
  this.population = [];
  for(let i = 0; i < populationCount; i++) {
    this.population.push(new Agent(ctx, xSpan, ySpan, gridGap, mutationRate));
  }

  this.update = () => {
    for(let i = 0; i < populationCount; i++) {
      this.population[i].update();
    }
    let flag = true;
    for(let i = 0; (i < populationCount) && flag; i++) {
      flag = flag &&this.population[i].hit;
    }
    return flag;
  };

  this.displayStats = (min, avg, max, generation) => {
    document.getElementById('cur_gen').innerHTML = `Current : ${generation}`;

    document.getElementById('cur_min').innerHTML = `${min}`;
    document.getElementById('cur_avg').innerHTML = `${avg}`;
    document.getElementById('cur_max').innerHTML = `${max}`;
    if(this.previousStats) {
      document.getElementById('prev_gen').innerHTML = `Previous : ${generation - 1}`;

      document.getElementById('prev_min').innerHTML = `${this.previousStats.min}`;
      document.getElementById('prev_avg').innerHTML = `${this.previousStats.avg}`;
      document.getElementById('prev_max').innerHTML = `${this.previousStats.max}`;

      document.getElementById('stats_min').innerHTML = `${this.previousStats.min > min}`;
      document.getElementById('stats_avg').innerHTML = `${this.previousStats.avg > avg}`;
      document.getElementById('stats_max').innerHTML = `${this.previousStats.max > max}`;
    }
    this.previousStats = {
      min: min,
      avg: avg,
      max: max
    };
  };

  this.normaliseFitness = (generation) => {
    let fitnesses = this.population.map(obj => obj.fitness);
    let min = Math.min(...fitnesses);
    let avg = fitnesses.reduce((a, b) => a + b, 0)/fitnesses.length;
    let max = Math.max(...fitnesses);
    this.displayStats(min, avg, max, generation);
    let threshold = 2*avg - min;
    let upper = Math.exp(threshold - min);
    for(let i = 0; i < populationCount; i++) {
      if(this.population[i].fitness > threshold) {
        this.population[i].fitness = 0.01;
      } else {
        this.population[i].fitness = (1 - Math.exp(this.population[i].fitness - min)/upper);
        if(this.population[i].hit) {
          this.population[i].fitness /= 10;
        }
      }
    }
  };

  this.createGenePool = () => {
    let pool = [];
    for(let i = 0; i < populationCount; i++) {
      let j = this.population[i].fitness*100>>0;
      while(j--) {
        pool.push(this.population[i]);
      }
    }
    return pool;
  };

  this.naturalSelection = (genePool) => {
    for(let i = 0; i < populationCount; i++) {
      let mateA = genePool[Math.random()*genePool.length>>0];
      let mateB = genePool[Math.random()*genePool.length>>0];
      this.population[i] = mateA.mate(mateB);
    }
  };

  this.migrateGeneration = (generation) => {
    for(let i = 0; i < populationCount; i++) {
      this.population[i].calcFitness(target);
    }
    let best_tuple = this.getBest();
    this.normaliseFitness(generation);
    let genePool = this.createGenePool();
    this.naturalSelection(genePool);
    for(let i = 0; i < populationCount; i++) {
      this.population[i].mutate();
    }
    return best_tuple;
  };

  this.getBest = () => {
    let best = this.population[0];
    for(let i = 0; i < populationCount; i++) {
      if(best.fitness > this.population[i].fitness) {
        best = this.population[i];
      }
    }
    return [best, best.fitness != 0];
  };
}
