import { Constraint } from "./constraint";

export class NoValueConstraintBuilder extends Constraint {
  constructor(opts = {}) {
    super(opts);
  }

  build() {
    if (!super.build()) return;
    const { errFn, constraintFn } = this;
    // new base (yup type constraint instance)
    return constraintFn(errFn);
  }
}
