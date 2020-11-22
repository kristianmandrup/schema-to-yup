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

export class YupBaseType extends Base {
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
    return this.setTypeInstance(inst)
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

  validateKey(key, opts) {
    if (!key) {
      this.error(`create: missing key ${this.stringify(opts)}`);
    }
    return this
  }

  validateValue(value, opts) {
    if (!value) {
      this.error(`create: missing value ${this.stringify(opts)}`);
    }
    return this
  }

  validateOnCreate(key, value, opts) {
    this.validateKey(key, opts)
    this.validateValue(value, opts)
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

  createConverter() {
    return new this.classMap.Converter(this, this.opts)
  }

  createMixed() {
    return new this.classMap.YupMixed(this.opts)
  }
}
