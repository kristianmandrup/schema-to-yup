import { Constraint } from "./constraint";

export class SingleValueConstraintBuilder extends Constraint {
  constructor(opts = {}) {
    super(opts);
  }

  build(constraintValue) {
    super.build(constraintValue);
    if (!this.isPresent(constraintValue)) return;

    const { errFn, constraintFn } = this;

    const newBase = this.isPresent(constraintValue)
      ? constraintFn(constraintValue, errFn)
      : constraintFn(errFn);

    return newBase;
  }

  isValidValue(value) {
    return !Array.isArray(value);
  }
}
