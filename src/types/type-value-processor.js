import { Loggable } from "./_loggable";

export class TypeValueProcessor extends Loggable {
  constructor(handler, opts = {}) {
    super(opts.config)    
    this.handler = handler
  }

  get modeSelector() {
    return this.handler.typeModeSelector
  }

  get mixed() {
    return this.handler.mixed
  }

  get disabledMode(mode) {
    return this.typeModeSelector.disabledMode(mode)
  }

  get isRequired(value) {
    return this.mixed.isRequired(value)
  }

  get shouldPreProcessValue() {
    return !this.disabledMode("notRequired");
  }
  
  preProcessedConstraintValue(value) {
    if (!this.shouldPreProcessValue) return value;
  
    if (!this.isRequired(value)) {
      return {
        ...value,
        notRequired: true
      };
    }
    return value;
  }
  
  set value(value) {
    this._value = this.preProcessedConstraintValue(value);
  }
  
  get value() {
    return this._value;
  }
}
