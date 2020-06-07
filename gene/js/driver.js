var Driver = function () {
  this.agents = [];
  this.statistics = null;
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

  this.updateStatistics = (statistics) => {
    document.getElementById('gen_num').innerHTML = parseInt(document.getElementById('gen_num').innerHTML.trim())+1;
    document.getElementById('min_dist').innerHTML = statistics.distance.min;
    document.getElementById('avg_dist').innerHTML = statistics.distance.avg;
    document.getElementById('max_dist').innerHTML = statistics.distance.max;
    document.getElementById('min_time').innerHTML = statistics.time.min;
    document.getElementById('max_time').innerHTML = statistics.time.max;
    if(this.statistics) {
      document.getElementById('min_dist_parent').className = statistics.distance.min < this.statistics.distance.min ? 'success': 'danger';
      document.getElementById('avg_dist_parent').className = statistics.distance.avg < this.statistics.distance.avg ? 'success': 'danger';
      document.getElementById('max_dist_parent').className = statistics.distance.max  < this.statistics.distance.max ? 'success': 'danger';
      document.getElementById('min_time_parent').className = statistics.time.min < this.statistics.time.min ? 'success': 'danger';
      document.getElementById('max_time_parent').className = statistics.time.max < this.statistics.time.max ? 'success': 'danger';
    }
    this.statistics = statistics;
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
    statistics.time.max = ( statistics.time.min === statistics.time.max)? statistics.time.max + 1: statistics.time.max;
    statistics.distance.max = Math.min(2*statistics.distance.avg - statistics.distance.min, statistics.distance.max);
    statistics.distance.maxExp = Math.exp(statistics.distance.max);
    this.updateStatistics(statistics);
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
