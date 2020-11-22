import { Converter } from './converter'
import { TypeModeSelector } from './type-mode-selector'
import { TypeValueProcessor } from './type-value-processor'
import { TypeErrorHandler } from './type-error-handler'
import { YupMixed } from './mixed'

const defaults = {
  classMap: {
    Converter,
    YupMixed,
    TypeModeSelector,
    TypeValueProcessor,
    TypeErrorHandler
  }
}

class YupBaseType extends Base {
  constructor(opts = {}) {
    super(opts.config);
    this.init()
  }

  setTypeInstance(inst) {
    this.base = inst || this.base
    return this
  }

  chain(cb) {
    return this.setTypeInstance(cb(this.base))
  }

  setInstType(name = this.yupType) {
    this.type = name;    
    const inst = this.yup[name]()
    return this.setYupTypeInstance(inst)
  }

  valErrMessage(msgName) {
    return this.typeErrorHandler.valErrMessage(msgName)
  }

  valErrMessageOr(...msgNames) {
    return this.typeErrorHandler.valErrMessageOr(...msgNames)
  }

  addConstraint(alias, opts) {
    this.constraintsAdder.addConstraint(alias, opts)
  }

  validateOnCreate(key, value, opts) {
    if (!key) {
      this.error(`create: missing key ${this.stringify(opts)}`);
    }
    if (!value) {
      this.error(`create: missing value ${this.stringify(opts)}`);
    }
  }

  init() {
    this.setYupType()
    this.mixed = this.createMixed()
    this.converter = this.createConverter()  
    this.constraintsProcessor = this.createConstraintsProcessor()  
    this.typeModeSelector = this.createTypeModeSelector()
    this.typeValueProcessor = this.createTypeValueProcessor()
    this.typeErrorHandler = this.createTypeErrorHandler()
    return this
  }

  setClassMap() {
    const { config } = this
    this.classMap = {
      ...defaults.classMap,
      ...config.classMap || {}
    }
  }

  createValueProcessor() {
    return new this.classMap.TypeValueProcessor(this, this.config);
  }

  createTypeModeSelector() {
    return new this.classMap.TypeModeSelector(this, this.config);
  }

  createTypeErrorHandler() {
    return new this.classMap.TypeErrorHandler(this, this.config);
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

  createConverter(config = this.converterConfig()) {
    return new this.classMap.Converter(this, this.opts, config)
  }

  createMixed() {
    return new this.classMap.YupMixed(this.opts)
  }
}

export { YupBaseType }