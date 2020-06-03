var Driver = function () {
  this.agents = [];
  for(let i = 0; i < GlobalConstants.agentsNum; i++) {
    this.agents.push(new Agent(false));
  }

  this.drawAgents = () => {
    let originalFillStyle = Grid.context.fillStyle;
    Grid.context.fillStyle = GlobalConstants.agentColor;
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      Grid.context.fillRect(
        this.agents[i].x*GlobalConstants.gridGap,
        this.agents[i].y*GlobalConstants.gridGap,
        GlobalConstants.agentSpan,
        GlobalConstants.agentSpan);
    }
    Grid.context.fillStyle = originalFillStyle;
  };

  this.updateAgents = () => {
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      this.agents[i].update();
    }
    this.drawAgents();
    let flag = false;
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      flag = flag || !(this.agents[i].stopped || this.agents[i].hitByObstacle);
    }
    return flag;
  };

  this.deriveStatistics = () => {
    let distances = this.agents.map(x => x.distanceFromTarget);
    let times = this.agents.map(x => x.time);
    let statistics = {
      distance: {
        min: Math.min(...distances),
        avg: distances.reduce((x, y) => x + y, 0)/distances.length,
        max: Math.max(...distances)
      },
      time: {
        min: Math.min(...times),
        max: Math.max(...times)
      }
    }
    statistics.distance.max = Math.min(2*statistics.distance.avg - statistics.distance.min, statistics.distance.max);
    statistics.distance.maxExp = Math.exp(statistics.distance.max);
    return statistics;
  };

  this.createGenePool = () => {
    let pool = [];
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      let j = this.agents[i].fitness*1000>>0;
      while(j--) {
        pool.push(this.agents[i]);
      }
    }
    return pool;
  };

  this.naturalSelection = (pool) => {
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      let mateA = pool[Math.random()*pool.length>>0];
      let mateB = pool[Math.random()*pool.length>>0];
      this.agents[i] = mateA.mate(mateB);
    }
  }

  this.migrateGeneration = () => {
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      this.agents[i].calculateDistanceFromTarget();
    }
    let statistics = this.deriveStatistics();
    for(let i = 0; i < GlobalConstants.agentsNum; i++) {
      this.agents[i].fitnessFunction(statistics);
    }
    let pool = this.createGenePool();
    this.naturalSelection(pool);
    return statistics;
  }

  this.drawAgents();
}
