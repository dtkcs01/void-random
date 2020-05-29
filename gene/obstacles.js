var Obstacles = function (ctx, xSpan, ySpan, gridGap, obstacleCount) {
  this.obstacles = [];
  for(let i = 0; i < obstacleCount; i++) {
    this.obstacles.push(new Obstacle(ctx, xSpan, ySpan, gridGap));
  }
  this.draw = () => {
    for(let i = 0; i < obstacleCount; i++) {
      this.obstacles[i].draw();
    }
  };
}

var Obstacle = function (ctx, xSpan, ySpan, gridGap) {
  this.x = Math.random()*xSpan>>0;
  this.y = Math.random()*ySpan>>0;
  this.width = 0;
  this.height = 0;
  while(!this.width || !this.height) {
    this.width = Math.random()*(xSpan/20)>>0;
    this.height = Math.random()*(ySpan/3)>>0;
  }
  this.draw = () => {
    ctx.fillRect(this.x*gridGap, this.y*gridGap, this.width*gridGap, this.height*gridGap);
  };
}
