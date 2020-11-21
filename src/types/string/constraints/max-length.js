import { BaseTypeConstraint } from "../../base-type-constraint";

export class MaxLength extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const { maxLength } = this.constraints;
    const errMsg = this.valErrMessage("maxLength") || this.valErrMessage("max");
    const newBase = maxLength && this.base.max(maxLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }
}