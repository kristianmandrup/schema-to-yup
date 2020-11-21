import { Loggable } from "./_loggable";

export class BaseTypeConstraintsProcessor extends Loggable {
  constructor(handler, opts = {}) {
    super(opts.config)
    this.handler = handler
    this.handler.normalize()    
  }

  get constraints() {
    return this.handler.constraints
  }

  init() {
    this.setConstraintsMap()
    this.setFactoriesMap()
  }

  setConstraintsMap() {
    this.constraintsMap = {
      ...this.maps.classMap,
      ...this.opts.classMap || {},      
    }
  }  

  setFactoriesMap() {
    this.factories = {
      ...this.maps.factories,
      ...this.opts.typeConstraintFactories || {},      
    }
  }  

  createTypeConstraintProcessorFor(name) {
    const { fromClass, fromFactory } = this
    return fromFactory(name) || fromClass(name)    
  }

  fromClass(name) {
    const Clazz = this.constraintsMap[name]
    if (!Clazz) return
    return new Clazz(this.handler, this.opts)
  }

  fromFactory(name) {
    const factory = this.factories[name]
    if (!factory) return
    return factory(this.handler, this.opts)
  }

  process(name) {
    const processor = createTypeConstraintProcessorFor(name)
    processor.process()
  }
}
