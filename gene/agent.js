var Agent = function (ctx, xSpan, ySpan, gridGap, mutationRate) {
  this.x = 0;
  this.y = ySpan/2>>0;
  this.hit = false;

  this.randomVector = () => {
    let x = Math.random()*2>>0;
    let y = Math.random()*2>>0;
    if(x == 0 && y == 0) {
      if(Math.random()*2>>0) {
        x = 1;
      } else {
        y = 1;
      }
    }
    y = Math.random()*2>>0? -y: y;
    return [x, y];
  };

  this.draw = () => {
    ctx.fillRect(this.x*gridGap, this.y*gridGap, 2, 2);
  };

  this.detectAndRemoveCycle = (x, y) => {
    if(x < xSpan + 1 && y < ySpan + 1 && y >= 0){
      let v = this.vectors[y][x];
      let nx = x + v[0];
      let ny = y + v[1];
      if(nx == this.x && ny == this.y) {
        v[0] = 1;
      }
    }
  };

  this.detectCrashWithObstacles = () => {
    for(let i = 0; i < grid.obstacles.obstacles.length; i++) {
      let x1 = grid.obstacles.obstacles[i].x;
      let y1 = grid.obstacles.obstacles[i].y;
      let x2 = grid.obstacles.obstacles[i].x + grid.obstacles.obstacles[i].width;
      let y2 = grid.obstacles.obstacles[i].y + grid.obstacles.obstacles[i].height;

      if(this.x >= x1 && this.x <= x2 && this.y >= y1 && this.y <= y2) {
        this.hit = true;
      }
    }
  };

  this.update = () => {
    if(this.x < xSpan + 1 && this.y < ySpan + 1 && this.y >= 0 && !this.hit){
      let v = this.vectors[this.y][this.x];
      let x = this.x + v[0];
      let y = this.y + v[1];
      this.detectAndRemoveCycle(x, y);
      this.detectCrashWithObstacles(x, y);
      this.x = x;
      this.y = y;
    }
    this.draw();
  };

  this.calcFitness = (target) => {
    let abx = this.x - target.x;
    let aby = this.y - target.y;
    this.fitness = Math.pow(Math.pow(abx, 2) + Math.pow(aby, 2), 0.5);
  };

  this.mate = (other) => {
    let strong = this.fitness >= other.fitness? this: other;
    let weak = this.fitness < other.fitness? this: other;
    let strongToWeakRatio = strong.fitness/(strong.fitness + weak.fitness);
    let child = new Agent(ctx, xSpan, ySpan, gridGap, mutationRate);
    for(let i = 0; i < ySpan + 1; i++) {
      for(let j = 0; j < xSpan + 1; j++) {
        child.vectors[i][j][0] = strong.vectors[i][j][0];
        child.vectors[i][j][1] = strong.vectors[i][j][1];
      }
    }
    return child;
  };

  this.mutate = () => {
    for(let i = 0; i < ySpan + 1; i++) {
      for(let j = 0; j < xSpan + 1; j++) {
        if(Math.random() < mutationRate){
          this.vectors[i][j] = this.randomVector();
        }
      }
    }
  };

  this.showVectors = () => {
    for(let i = 0; i < ySpan + 1; i++) {
      for(let j = 0; j < xSpan + 1; j++) {
        if(this.vectors[i][j][0] == 0) {
          if(this.vectors[i][j][1] == 1) {
            ctx.beginPath();
              ctx.moveTo(j*gridGap, i*gridGap);
              ctx.lineTo(j*gridGap + 6, i*gridGap);
              ctx.lineTo(j*gridGap + 3, i*gridGap + 6);
              ctx.lineTo(j*gridGap, i*gridGap);
              ctx.fill();
            ctx.closePath();
          } else {
            ctx.beginPath();
              ctx.moveTo(j*gridGap, i*gridGap + 6);
              ctx.lineTo(j*gridGap + 6, i*gridGap + 6);
              ctx.lineTo(j*gridGap + 3, i*gridGap);
              ctx.lineTo(j*gridGap, i*gridGap + 6);
              ctx.fill();
            ctx.closePath();
          }
        } else {
          if(this.vectors[i][j][1] == 1) {
            ctx.beginPath();
              ctx.moveTo(j*gridGap + 6, i*gridGap);
              ctx.lineTo(j*gridGap + 6, i*gridGap + 6);
              ctx.lineTo(j*gridGap, i*gridGap + 6);
              ctx.lineTo(j*gridGap + 6, i*gridGap);
              ctx.fill();
            ctx.closePath();
          } else if(this.vectors[i][j][1] == 0) {
            ctx.beginPath();
              ctx.moveTo(j*gridGap, i*gridGap);
              ctx.lineTo(j*gridGap + 6, i*gridGap + 3);
              ctx.lineTo(j*gridGap, i*gridGap + 6);
              ctx.lineTo(j*gridGap, i*gridGap);
              ctx.fill();
            ctx.closePath();
          } else {
            ctx.beginPath();
              ctx.moveTo(j*gridGap, i*gridGap);
              ctx.lineTo(j*gridGap + 6, i*gridGap);
              ctx.lineTo(j*gridGap + 6, i*gridGap + 6);
              ctx.lineTo(j*gridGap, i*gridGap);
              ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
  };

  this.vectors = [];
  for(let i = 0; i < ySpan + 1; i++) {
    let row = [];
    for(let j = 0; j < xSpan + 1; j++) {
      row.push(this.randomVector())
    }
    this.vectors.push(row);
  }
  this.draw();
}
