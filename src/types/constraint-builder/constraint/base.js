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
    this.yup = yup;
    this.errFn = errFn;
    this.constraintFn = constraintFn;
    this.constraintName = constraintName;
    this.onConstraintAdded = onConstraintAdded;
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }
}
