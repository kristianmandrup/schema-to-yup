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
    const { constraints, sizeHelper } = this
    const { maxItems, max } = constraints;
    const { handleInvalidSize, isValidSize } = sizeHelper
    const $max = maxItems || max;
    if (!typeMatcher.isNumberType($max)) {
      return this;
    }
    if (!isValidSize($max)) {
      return handleInvalidSize("maxItems", $max);
    }
    return this.chain(x => $max && x.max($max));
  }
}