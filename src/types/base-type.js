import { Converter } from './converter'
import { TypeModeSelector } from './type-mode-selector'
import { TypeValueProcessor } from './type-value-processor'
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
    this.init()
  }

  setYupTypeInstance(inst) {
    this.base = inst
    return this
  }

  chainYup(cb) {
    this.base = cb(this.base)
    return this
  }

  setYupType(name = this.yupType) {
    this.type = name;    
    const inst = this.yup[name]()
    return this.setYupTypeInstance(inst)
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
    this.setYupType()
    this.mixed = this.createMixed()
    this.converter = this.createConverter()  
    this.constraintsProcessor = this.createConstraintsProcessor()  
    this.typeModeSelector = this.createTypeModeSelector()
    this.typeValueProcessor = this.createTypeValueProcessor()
    return this
  }

  createValueProcessor() {
    return new TypeValueProcessor(this, this.config);
  }

  createTypeModeSelector() {
    return new TypeModeSelector(this, this.config);
  }

  get constraintsAdder() {
    return this.converter.constraintsAdder
  }

  convert() {
    this.converter.convert();
    return this;
  }

  get converterConfig() {
    return { typeEnabled: this.typeEnabled, type: this.type }
  }

  createConverter(config) {
    return new this.classMap.Converter(this.opts, config)
  }

  createMixed() {
    return new this.classMap.YupMixed(this.opts)
  }
}

export { YupBaseType }