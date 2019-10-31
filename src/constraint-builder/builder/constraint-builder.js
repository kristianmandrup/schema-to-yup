import { Loggable } from "../../_loggable";

export class ConstraintBuilder extends Loggable {
  constructor(opts = {}) {
    super(opts);
    this.constraints = opts.constraints || {};
    this.typeConstrainerInst = opts.typeConstrainerInst;
    this.errMessages = opts.errMessages || {};
    this.opts = opts;
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }

  build(propertyName, opts = {}) {
    opts = {
      propertyName,
      ...this.opts,
      opts
    };
    if (!propertyName) {
      this.error("build: missing prop name");
    }

    const constraintValue = this.constraintValueFor({ ...opts, propertyName });
    if (!this.validateConstraintValue(constraintValue))
      return this.defaultContraint();

    const constraint = this.createConstraint({
      ...opts,
      constraintValue
    });

    if (constraint) return constraint;
    return this.defaultContraint();
  }

  defaultContraint() {
    this.warn("No type constrainer instance could be built", opts);
    return this.typeConstrainerInst;
  }

  createConstraint(opts = {}) {
    let constraintCreator = opts.constraintCreator || this.constraintCreator;
    return constraintCreator.create(opts);
  }

  constraintValueFor(opts = {}) {
    let constraintValueProvider =
      opts.constraintValueProvider || this.constraintValueProvider;
    return constraintValueProvider.provide(opts);
  }

  validateConstraintValue(constraintValue) {
    if (this.isNothing(constraintValue)) {
      this.warn("no prop value");
      return false;
    }
    return true;
  }
}
