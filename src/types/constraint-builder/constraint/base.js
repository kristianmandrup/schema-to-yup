import { Loggable } from "../../_loggable";

export class Constraint extends Loggable {
  constructor(opts = {}) {
    super(opts);
    const {
      errFn,
      constraintFn,
      constraintName,
      yup,
      onConstraintAdded
    } = opts;
    this.validateConstraintOpts(opts);
    this.yup = yup;
    this.errFn = errFn;
    this.constraintFn = constraintFn;
    this.constraintName = constraintName;
    this.onConstraintAdded = onConstraintAdded;
  }

  validateConstraintOpts(opts) {
    ["constraintFn"].map(
      name => this.isNothing(opts[name]) && this.missingConstraintOpt(name)
    );
  }

  missingConstraintOpt(name) {
    this.error(`Constraint: missing ${name}`);
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }
}
