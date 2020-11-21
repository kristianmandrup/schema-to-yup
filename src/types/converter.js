import uniq from "uniq";
import { Loggable } from "./_loggable";

export class Converter extends Loggable {
  constructor(opts = {}) {
    super(opts)
    this.constraintsAdder = this.createConstraintsAdder(opts)
  }

  // override for each type
  get typeEnabled() {
    return this._typeEnabled || [];
  }

  get $typeExtends() {
    if (!Array.isArray(this.typeConfig.extends)) return;
    return uniq([...this.typeConfig.extends, ...this.typeEnabled]);
  }

  get configuredTypeEnabled() {
    return Array.isArray(this.typeConfig.enabled)
      ? this.typeConfig.enabled
      : this.typeEnabled;
  }

  get $typeEnabled() {
    return this.$typeExtends || this.configuredTypeEnabled;
  }

  get enabled() {
    return [...this.mixedEnabled, ...this.$typeEnabled];
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