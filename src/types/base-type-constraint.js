import { Loggable } from "./_loggable"

export class BaseTypeConstraint extends Loggable {
  constructor(handler, opts = {}) {
    super(opts)
    this.typeHandler = handler
    this.value = handler.value
    this.errorHandler = handler.errorHandler || new TypeErrorHandler(this.opts)
  }

  get base() {
    return this.handler.base
  }

  get constraints() {
    return this.handler.constraints
  }

  set base(base) {
    this.handler.base = base
  } 

  chainYup(cb) {
    this.handler.base = cb(this.base)
    return this
  }

  get addConstraint() {
    return this.typeHandler.addConstraint
  }
}