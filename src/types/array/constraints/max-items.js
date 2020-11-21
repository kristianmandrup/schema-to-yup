import { BaseTypeConstraint } from "../../base-type-constraint";
import { typeMatcher } from "../../_type-matcher";
import { ArraySizeHelper } from "./size-helper";

export const maxItems = (handler, opts) => new MaxItems(handler, opts)

export class MaxItems extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
    this.sizeHelper = new ArraySizeHelper(handler, opts)
  }

  process() {
    const { maxItems, max } = this.constraints;
    const { handleInvalidSize, isValidSize } = this.sizeHelper
    const $max = maxItems || max;
    if (!typeMatcher.isNumberType($max)) {
      return this;
    }
    if (!isValidSize($max)) {
      return handleInvalidSize("maxItems", $max);
    }
    const newBase = $max && this.base.max($max);
    this.base = newBase || this.base;
    return this;
  }
}