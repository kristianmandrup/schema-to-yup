import uniq from "uniq";
import { Base } from "./base";
import { ConstraintsAdder } from './constraints-adder'
import { constraintsMap } from './constraints-map'

const defaults = {
  classMap: {
    ConstraintsAdder
  }
}

export class Converter extends Base {
  constructor(handler, opts = {}) {
    super(opts.config)
    this.handler = handler
    this.constraintsAdder = this.createConstraintsAdder(opts)
    this.init()
  }

  get constraintsMap() {
    return {
      ...constraintsMap,
      ...this.config.constraintsMap || {}
    }
  }

  get typeEnabled() {
    return this.handler.typeEnabled
  }

  get type() {
    return this.handler.type
  }

  init() {
    this.setClassMap(defaults)
  }

  get typeConfig() {
    return this.config[this.type] || {};
  }

  calcTypeExtends() {
    const { typeConfig, typeEnabled } = this
    if (!Array.isArray(typeConfig.extends)) return;
    return uniq([...typeConfig.extends, ...typeEnabled]);
  }

  get configuredTypeEnabled() {
    const { typeConfig, typeEnabled } = this    
    return Array.isArray(typeConfig.enabled)
      ? typeConfig.enabled
      : typeEnabled;
  }

  calcTypeEnabled() {
    return this.calcTypeExtends() || this.configuredTypeEnabled;
  }

  get enabled() {
    return [...this.mixedEnabled, ...this.calcTypeEnabled()];
  }

  convertEnabled() {
    this.enabled.map(name => {
      const convertFn = this.convertFnFor(name);
      if (convertFn) {
        convertFn(this);
      }
    });
  }

  convertFnFor(name) {
    return this.customConvertFnFor(name) || this.builtInConvertFnFor(name);
  }

  customConvertFnFor(name) {
    const typeConvertMap = this.typeConfig.convert || {};
    return typeConvertMap[name];
  }

  builtInConvertFnFor(name) {
    return this.constraintsProcessor.process(name)
  }  

  get constraintsProcessor() {
    const Clazz = this.constraintsMap[this.type].Processor
    return new Clazz(this.handler, this.opts)
  }

  convert() {
    this.initHelpers();
    this.addMappedConstraints();
    this.convertEnabled();
    return this;
  }

  createConstraintsAdder(opts) {
    return new this.classMap.ConstraintsAdder(opts)
  }
}