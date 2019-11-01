import { Loggable } from "../../../../../_loggable";

export class Size extends Loggable {
  // utility

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
    return this.isNumberType(num) && num >= 0;
  }
}
