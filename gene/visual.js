var grid = {
  canvas: document.createElement('canvas'),
  generations: 0,
  agents: null,
  cycles: 0,
  obstacles: null,
  start: function(xSpan, ySpan, gridGap, populationCount, mutationRate, obstacleCount) {
    this.canvas.height = ySpan*gridGap;
    this.canvas.width = xSpan*gridGap;
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '#FFFFFF';
    let target = { x: xSpan, y: ySpan/2>>0 }
    this.agents = new Agents(this.context, xSpan, ySpan, gridGap, populationCount, target, mutationRate);
    this.obstacles = new Obstacles(this.context, xSpan, ySpan, gridGap, obstacleCount);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  update: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#FF0000';
    this.obstacles.draw();
    this.context.fillStyle = '#FFFFFF';
    return this.agents.update();
  }
};

var evolve = function (cycleRate, cycleCap, generationCap) {
  if(grid.generations++ < generationCap) {
    grid.cycles = 0;
    var int = setInterval(function () {
      let flag = grid.update();
      grid.cycles++;
      if(grid.cycles == cycleCap || flag) {
        clearInterval(int);
        let best_tuple = grid.agents.migrateGeneration(grid.generations)
        if(best_tuple[1]) {
          evolve(cycleRate, cycleCap, generationCap);
        } else {
          grid.context.globalAlpha = 0.2;
          grid.context.clearRect(0, 0, grid.canvas.width, grid.canvas.height);
          best_tuple[0].showVectors();
        }
      }
    }, cycleRate);
  }
};

$(document).ready(function () {
  const xSPAN = 100;
  const ySPAN = 60;
  const gridGAP = 10;
  const populationCOUNT = 200;
  const cycleRATE = 66;
  const cycleCAP = 150;
  const generationCAP = 200000;
  const mutationRATE = 0.02;
  const obstacleCOUNT = 10;
  grid.start(xSPAN, ySPAN, gridGAP, populationCOUNT, mutationRATE, obstacleCOUNT);
  evolve(cycleRATE, cycleCAP, generationCAP);
});
