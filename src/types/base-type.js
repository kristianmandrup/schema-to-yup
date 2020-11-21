import { Converter } from './converter'
import { YupMixed } from './mixed'

const defaults = {
  classMap: {
    Converter,
    YupMixed
  }
}

class YupBaseType extends Base {
  constructor(opts = {}) {
    super(opts.config);

    const classMap = opts.config && opts.config.classMap

    this.classMap = {
      ...defaults.classMap,
      ...classMap || {}
    }
    this.init()
  }

  addConstraint(alias, opts) {
    this.constraintsAdder.addConstraint(alias, opts)
  }

  validateOnCreate(key, value, opts) {
    if (!key) {
      this.error(`create: missing key ${JSON.stringify(opts)}`);
    }
    if (!value) {
      this.error(`create: missing value ${JSON.stringify(opts)}`);
    }
  }

  init() {
    this.mixed = this.createMixed()
    this.converter = this.createConverter({typeEnabled: this.typeEnabled})    
  }

  get constraintsAdder() {
    return this.converter.constraintsAdder
  }

  createConverter(config) {
    return new this.classMap.Converter(this.opts, config)
  }

  createMixed() {
    return new this.classMap.YupMixed(this.opts)
  }
}

export { YupBaseType }