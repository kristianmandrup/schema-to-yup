import { Size } from "./size";

export class MinItems extends Size {
  constructor(typeHandler) {
    super(typeHandler);
  }

  apply() {
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
