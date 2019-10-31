export class ConstraintValueProvider {
  constructor(opts = {}) {
    this.constraintValueMap = opts.constraintValueMap || {};
  }

  constraintValueFor(propertyMap) {
    return this.constraintValueMap[propertyMap];
  }

  valueFor(opts = {}) {
    const { constraintValue, propertyValue, propertyName } = opts;
    return (
      constraintValue || propertyValue || this.constraintValueFor(propertyName)
    );
  }
}
