class FormDataHandler {
  constructor() {
    this.tag = 'globalConstants.js';
    this.validators = {};
    this.initializeValidators();
  }

  initializeValidators() {
    this.colsNumValidator();
    this.rowsNumValidator();
    this.gridGapValidator();
    this.agentsNumValidator();
    this.mutationRateValidator();
    this.maxCyclesValidator();
    this.maxGenerationsValidator();
  }

  colsNumValidator() {
    this.validators.colsNum = {
      min: 10,
      max: 120,
      type: parseInt,
      default: () => { return 100; }
    };
  }

  rowsNumValidator() {
    this.validators.rowsNum = {
      min: 10,
      max: 100,
      type: parseInt,
      default: () => { return 70; }
    };
  }

  gridGapValidator() {
    this.validators.gridGap = {
      min: 4,
      max: 20,
      type: parseInt,
      default: () => { return 10; }
    };
  }

  agentsNumValidator() {
    this.validators.agentsNum = {
      min: 10,
      max: 1000,
      type: parseInt,
      default: () => { return 200; }
    };
  }

  mutationRateValidator() {
    this.validators.mutationRate = {
      min: 0,
      max: 1,
      type: parseFloat,
      default: () => { return 0.02; }
    };
  }

  maxCyclesValidator() {
    this.validators.maxCycles = {
      min: 100,
      max: 12000,
      type: parseInt,
      default: () => {
        let driver = (Math.random()*2>>0? (Math.random()*2>>0? -1: 1): 0);
        let sum = this.validators.colsNum.val + this.validators.rowsNum.val;
        let dot = this.validators.colsNum.val * this.validators.rowsNum.val;
        let switchCase = {
          '-1': () => { return sum; },
          '0': () => { return (dot + sum)/2 >> 0; },
          '1': () => { return dot; }
        }
        return switchCase[driver]();
      }
    };
  }

  maxGenerationsValidator() {
    this.validators.maxGenerations = {
      min: 100,
      max: null,
      type: parseInt,
      default: () => { return null; }
    };
  }

  validate(jQueryInput) {
    let id = jQueryInput.attr('id');
    if(jQueryInput.val()) {
      let val = this.validators[id].type(jQueryInput.val());
      if(val >= this.validators[id].min && (!this.validators[id].max || val <= this.validators[id].max)) {
        this.validators[id].val = val;
      } else {
        alert('Invalid input... Reverting to default value!!');
        this.validators[id].val = this.validators[id].default();
      }
    } else {
      this.validators[id].val = this.validators[id].default();
    }
  }

  inputHandler(jQueryInput) {
    if(jQueryInput.attr('type') == 'number') {
      this.validate(jQueryInput);
    } else if(jQueryInput.attr('type') == 'checkbox') {
      this.validators.areObjectsRandom = {};
      this.validators.areObjectsRandom.val = jQueryInput.is(':checked');
    } else {
      alert(`${ this.tag }: Invalid input type`);
    }
  }

  submitHandler() {
    let inputs = $('#parameter_form').find(':input');
    for(let input of inputs) {
      input = $(input);
      this.inputHandler(input);
    }
    for(let key in this.validators) {
      GlobalConstants[key] = this.validators[key].val;
    }
    GlobalConstants.refreshRate = this.validators.agentsNum.val/3>>0;
    GlobalConstants.target = new Agent(true);
    GlobalConstants.target.x = GlobalConstants.colsNum - 1;
    GlobalConstants.agentSpan = GlobalConstants.gridGap/4>>0;
    Grid.start();
  }

}

var Helper = {
  formDataHandler: new FormDataHandler(),
  randomVector: function() {
    let vector = { x: Math.random()*2>>0, y: Math.random()*2>>0 };
    if(!vector.x && !vector.y) {
      vector[(Math.random()*2>>0? 'x': 'y')] = 1;
    }
    vector.y = Math.random()*2>>0? -vector.y: vector.y;
    return [vector.x, vector.y];
  }
};

var GlobalConstants = {
  agentColor: '#FFFFFF',
  targetAgentColor: '#00FF00',
  obstacleColor: '#FF0000',
  obstaclesNum: 20
};
