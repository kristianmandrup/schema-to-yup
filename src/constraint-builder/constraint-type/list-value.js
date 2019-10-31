import { Constraint } from "./base";

export class ListValueConstraintBuilder extends Constraint {
  constructor(opts = {}) {
    super(opts);
  }

  build(constraintValue) {
    if (!super.build(constraintValue)) return;
    const { errFn, constraintFn } = this;
    // new base (yup type constraint instance)
    return constraintFn(constraintValue, errFn);
  }

  isValidValue(value) {
    return Array.isArray(value);
  }
}
