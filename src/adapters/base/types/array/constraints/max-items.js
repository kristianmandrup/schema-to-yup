import { Size } from "./size";

export class MaxItems extends Size {
  constructor(typeHandler) {
    super(typeHandler);
  }

  apply() {
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
