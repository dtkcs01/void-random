var Grid = {
  canvas: document.createElement('canvas'),
  driver: null,
  blockers: null,
  current_cycle: 0,
  current_generation: 0,
  start: function () {
    this.canvas.width = GlobalConstants.colsNum*GlobalConstants.gridGap;
    this.canvas.height = GlobalConstants.rowsNum*GlobalConstants.gridGap;
    this.context = this.canvas.getContext('2d');
    this.driver = new Driver();
    this.blockers = new Blockers();
    this.evolve();
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
          console.log(statistics);
          this.evolve();
        }
      }, GlobalConstants.refreshRate);
    }
  }
}
