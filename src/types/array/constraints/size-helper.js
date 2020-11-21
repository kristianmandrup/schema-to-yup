import { typeMatcher } from "../../_type-matcher";

export const arraySizeHelper = (opts) => new ArraySizeHelper(opts)

export class ArraySizeHelper {
  constructor(handler, opts = {}) {
    
  }

  handleInvalidSize(name, value) {
    const msg = `invalid array size constraint for ${name}, was ${value}. Must be a number >= 0`;
    if (this.config.warnOnInvalid) {
      this.warn(msg);
      return this;
    }
    this.error(msg, value);
    return this;
  }

  isValidSize(num) {
    return typeMatcher.isNumberType(num) && num >= 0;
  }
}