import { BaseTypeConstraint } from "../../base-type-constraint";

export class MaxItems extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const { maxItems, max } = this.constraints;
    const $max = maxItems || max;
    if (!this.isNumberType($max)) {
      return this;
    }
    if (!this.isValidSize($max)) {
      return this.handleInvalidSize("maxItems", $max);
    }
    const newBase = $max && this.base.max($max);
    this.base = newBase || this.base;
    return this;
  }
}