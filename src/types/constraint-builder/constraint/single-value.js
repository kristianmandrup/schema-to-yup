import { Constraint } from "./base";

export class SingleValueConstraintBuilder extends Constraint {
  constructor(opts = {}) {
    super(opts);
  }

  build(constraintValue) {
    if (!this.isPresent(constraintValue)) return;

    const { errFn, constraintFn, constraintName } = this;

    this.onConstraintAdded({ name: constraintName, value: constraintValue });

    const newBase = this.isPresent(constraintValue)
      ? constraintFn(constraintValue, errFn)
      : constraintFn(errFn);

    return newBase;
  }
}
