var Blockers = function () {
  this.obstacles = [];

  this.createObstacle = () => {
    while(true) {
      let obstacle = new Obstacle();
      if(GlobalConstants.target.x < obstacle.x || GlobalConstants.target.x > obstacle.x + obstacle.w) {
        if(GlobalConstants.target.y < obstacle.y || GlobalConstants.target.y > obstacle.y + obstacle.h) {
          return obstacle;
        }
      }
    }
  };

  this.randomiseObstacle = () => {
    for (let i = 0; i < GlobalConstants.obstaclesNum; i++) {
      this.obstacles.push(this.createObstacle());
    }
  };

  this.drawObstacles = () => {
    let originalFillStyle = Grid.context.fillStyle;
    Grid.context.fillStyle = GlobalConstants.obstacleColor;
    for(let i = 0; i < this.obstacles.length; i++) {
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
  this.w = Math.random()*5>>0;
  this.h = Math.random()*20>>0;
}
