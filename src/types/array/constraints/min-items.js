import { BaseTypeConstraint } from "../../base-type-constraint";

export class MinItems extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const { minItems, min } = this.constraints;
    const $min = minItems || min;
    if (!this.isNumberType($min)) {
      return this;
    }
    if (!this.isValidSize($min)) {
      return this.handleInvalidSize("minItems", $min);
    }
    const newBase = $min && this.base.min($min);
    this.base = newBase || this.base;
    return this;
  }
}