import { Loggable } from "./_loggable";

export class BaseTypeConstraintsProcessor extends Loggable {
  constructor(opts = {}) {
    super(opts)
  }

  init() {
    this.setConstraintsMap()
  }

  setConstraintsMap() {
    this.constraintsMap = {
      ...this.maps.classMap,
      ...this.opts.classMap || {},      
    }
  }  
}
