import uniq from "uniq";
import { Base } from "./base";
import { ConstraintsAdder } from './constraints-adder'

const defaults = {
  classMap: {
    ConstraintsAdder
  }
}

export class Converter extends Base {
  constructor(opts = {}, config) {
    super(opts.config)
    this.constraintsAdder = this.createConstraintsAdder(opts)
    this.init(config)
  }

  init(config) {
    this.setClassMap(defaults)
    const { typeEnabled, type } = config
    this.typeEnabled = typeEnabled
    this.type = type
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
    return this[name].bind(this);
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