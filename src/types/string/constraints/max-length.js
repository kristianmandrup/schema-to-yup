import { BaseTypeConstraint } from "../../base-type-constraint";

export const maxLength = (handler, opts) => new maxLength(handler, opts)

export class MaxLength extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { maxLength } = this.constraints;
    const errMsg = this.valErrMessage("maxLength") || this.valErrMessage("max");
    const newBase = maxLength && this.base.max(maxLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }
}