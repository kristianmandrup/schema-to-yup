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
    const { constraints, sizeHelper } = this
    const { minItems, min } = constraints;
    const { handleInvalidSize, isValidSize } = sizeHelper
    const $min = minItems || min;
    if (!typeMatcher.isNumberType($min)) {
      return this;
    }
    if (!isValidSize($min)) {
      return handleInvalidSize("minItems", $min);
    }
    return this.chain(x => $min && this.base.min($min));
  }
}