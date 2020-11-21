import { BaseTypeConstraint } from "../../base-type-constraint";

export class MinLength extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const { minLength } = this.constraints;
    const errMsg = this.valErrMessage("minLength") || this.valErrMessage("min");
    const newBase = minLength && this.base.min(minLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }
}