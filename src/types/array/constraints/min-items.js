import { BaseTypeConstraint } from "../../base-type-constraint";
import { typeMatcher } from "../../_type-matcher";
import { ArraySizeHelper } from "./size-helper";

export const minItems = (handler, opts) => new MinItems(handler, opts)

export class MinItems extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
    this.sizeHelper = new ArraySizeHelper(handler, opts)
  }

  process() {
    const { minItems, min } = this.constraints;
    const { handleInvalidSize, isValidSize } = this.sizeHelper
    const $min = minItems || min;
    if (!typeMatcher.isNumberType($min)) {
      return this;
    }
    if (!isValidSize($min)) {
      return handleInvalidSize("minItems", $min);
    }
    const newBase = $min && this.base.min($min);
    this.base = newBase || this.base;
    return this;
  }
}