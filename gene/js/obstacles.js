var Blockers = function () {
  this.obstacles = [];
  for (let i = 0; i < GlobalConstants.obstaclesNum; i++) {
    this.obstacles.push(new Obstacle());
  }

  this.drawObstacles = () => {
    let originalFillStyle = Grid.context.fillStyle;
    Grid.context.fillStyle = GlobalConstants.obstacleColor;
    for(let i = 0; i < GlobalConstants.obstaclesNum; i++) {
      Grid.context.fillRect(
        this.obstacles[i].x*GlobalConstants.gridGap,
        this.obstacles[i].y*GlobalConstants.gridGap,
        this.obstacles[i].w*GlobalConstants.gridGap,
        this.obstacles[i].h*GlobalConstants.gridGap
      );
    }
    Grid.context.fillStyle = originalFillStyle;
  };
}

var Obstacle = function () {
  this.x = Math.random()*GlobalConstants.colsNum>>0;
  this.y = Math.random()*GlobalConstants.rowsNum>>0;
  this.w = Math.random()*3>>0;
  this.h = Math.random()*6>>0;
}
