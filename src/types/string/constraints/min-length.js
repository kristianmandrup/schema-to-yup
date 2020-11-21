import { BaseTypeConstraint } from "../../base-type-constraint";

export const minLength = (handler, opts) => new MinLength(handler, opts)

export class MinLength extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { minLength } = this.constraints;
    const errMsg = this.valErrMessage("minLength") || this.valErrMessage("min");
    const newBase = minLength && this.base.min(minLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }
}