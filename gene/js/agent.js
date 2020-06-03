var Agent = function(isTarget) {
  this.x = 0;
  this.y = GlobalConstants.rowsNum/2>>0;
  if(!isTarget) {
    this.time = 0;
    this.stopped = false;
    this.hitByObstacle = false;
    this.vectors = [];
    for(let i = 0; i < GlobalConstants.rowsNum; i++) {
      let row = [];
      for(let j = 0; j < GlobalConstants.colsNum; j++) {
        row.push(Helper.randomVector());
      }
      this.vectors.push(row);
    }
  }

  this.detectAndRemoveCycle = (x, y) => {
    let v = this.vectors[y][x];
    x = x + v[0];
    y = y + v[1];
    if(this.x == x && this.y == y) {
      v[0] = 1;
    }
  };

  this.update = () => {
    let v = this.vectors[this.y][this.x];
    let x = this.x + v[0];
    let y = this.y + v[1];
    if(!this.stopped && !this.hitByObstacle && x < GlobalConstants.colsNum && y < GlobalConstants.rowsNum && y >= 0) {
      this.detectAndRemoveCycle(x, y);
      this.x = x;
      this.y = y;
      this.time += 1;
    } else {
      if(x >= GlobalConstants.colsNum) {
        this.stopped = true;
      } else {
        this.hitByObstacle = true;
      }
    }
  };

  this.calculateDistanceFromTarget = () => {
    let x = Math.pow(this.x - GlobalConstants.target.x, 2);
    let y = Math.pow(this.y - GlobalConstants.target.y, 2);
    this.distanceFromTarget = Math.pow(x + y, 0.5);
  };

  this.fitnessFunction = (statistics) => {
    let timeConstant = (this.time - statistics.time.min)/(statistics.time.max - statistics.time.min);
    if(this.distanceFromTarget > statistics.distance.max) {
      this.fitness = 0;
    } else {
      this.fitness = 1 - Math.exp(this.distanceFromTarget)/statistics.distance.maxExp;
      if(this.hitByObstacle) {
        this.fitness *= 0.1;
        this.fitness *= timeConstant;
      } else {
        this.fitness *= (1 - timeConstant);
      }
    }
  };

  this.mate = (other) => {
    let strong = this.fitness > other.fitness ? this: other;
    let weak = this.fitness <= other.fitness ? this: other;
    let child = new Agent();
    for(let i = 0; i < GlobalConstants.rowsNum; i++) {
      for(let j = 0; j < GlobalConstants.colsNum; j++) {
        if(Math.random() < GlobalConstants.mutationRate) {
          child.vectors[i][j] = Helper.randomVector();
        } else {
          child.vectors[i][j] = [...strong.vectors[i][j]];
        }
      }
    }
    return child;
  };
}
