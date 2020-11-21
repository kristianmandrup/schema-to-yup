export class TypeValueProcessor {
  constructor(opts = {}) {
    
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
