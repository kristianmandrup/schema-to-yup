import { Constraint } from "./base";

export class ListValueConstraintBuilder extends Constraint {
  constructor(opts = {}) {
    super(opts);
  }

  build(constraintValue) {
    if (!this.isPresent(constraintValue)) return;

    const { errFn, constraintFn, constraintName, yup } = this;

    // call yup constraint function with multiple arguments
    if (!Array.isArray(constraintValue)) {
      this.warn("buildConstraint: values option must be an array of arguments");
      return yup;
    }

    this.onConstraintAdded({ name: constraintName, value: constraintValue });

    const newBase = constraintFn(constraintValue, errFn);

    return newBase;
  }
}
