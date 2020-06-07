var Grid = {
  canvas: document.createElement('canvas'),
  driver: null,
  blockers: null,
  current_cycle: 0,
  mouse_down: false,
  current_generation: 0,
  start: function () {
    this.canvas.width = GlobalConstants.colsNum*GlobalConstants.gridGap;
    this.canvas.height = GlobalConstants.rowsNum*GlobalConstants.gridGap;
    this.context = this.canvas.getContext('2d');
    this.blockers = new Blockers();
    if(GlobalConstants.areObjectsRandom) {
      this.blockers.randomiseObstacle();
    }
    this.driver = new Driver();
    this.evolve();
    this.mouseListner();
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  update: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.blockers.drawObstacles();
    this.drawTarget();
    return this.driver.updateAgents();
  },
  drawTarget: function () {
    let originalFillStyle = this.context.fillStyle;
    this.context.fillStyle = GlobalConstants.targetAgentColor;
    this.context.fillRect(
      GlobalConstants.target.x*GlobalConstants.gridGap,
      GlobalConstants.target.y*GlobalConstants.gridGap,
      GlobalConstants.agentSpan,
      GlobalConstants.agentSpan
    );
    this.context.fillStyle = originalFillStyle;
  },
  evolve: function () {
    Grid.current_generation += 1;
    if(!GlobalConstants.maxGenerations || (this.current_generation < GlobalConstants.maxGenerations)) {
      this.current_cycle = 0;
      var cycles = setInterval(() => {
        this.current_cycle += 1;
        let continue_flag = this.update();
        if(!continue_flag || this.current_cycle >= GlobalConstants.maxCycles) {
          clearInterval(cycles);
          let statistics = this.driver.migrateGeneration();
          if(this.driver.statistics.distance.min > 0) {
            this.evolve();
          }
        }
      }, GlobalConstants.refreshRate);
    }
  },
  mouseListner: function () {
    let doc = $(document);
    doc.mousedown((event) => {
      this.mouse_down = true;
      let obstacle = new Obstacle();
      obstacle.x = event.pageX/GlobalConstants.gridGap>>0;
      obstacle.y = event.pageY/GlobalConstants.gridGap>>0;
      obstacle.w = 0;
      obstacle.h = 0;
      this.blockers.obstacles.push(obstacle);
    });
    doc.mousemove((event) => {
      if (this.mouse_down) {
        let obstacle = this.blockers.obstacles[this.blockers.obstacles.length - 1];
        obstacle.w = (event.pageX/GlobalConstants.gridGap>>0) - obstacle.x;
        obstacle.h = (event.pageY/GlobalConstants.gridGap>>0) - obstacle.y;
      }
    });
    doc.mouseup((event) => {
      let obstacle = this.blockers.obstacles[this.blockers.obstacles.length - 1];
      if(obstacle.w < 0) {
        obstacle.x = obstacle.x + obstacle.w;
        obstacle.w = -obstacle.w;
      }
      if(obstacle.h < 0) {
        obstacle.y = obstacle.y + obstacle.h;
        obstacle.h = -obstacle.h;
      }
      this.mouse_down = false;
    });
  }
}
