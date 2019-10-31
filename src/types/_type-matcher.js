import { Loggable } from "../_loggable";

export class TypeMatcher extends Loggable {
  constructor(config = {}) {
    super(config);
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }

  toNumber(num) {
    return Number(num);
  }

  isNumberLike(num) {
    return !isNaN(this.toNumber(num));
  }

  isObjectType(obj) {
    return obj === Object(obj);
  }

  isNumberType(num) {
    return !isNaN(num);
  }

  isStringType(val) {
    return typeof val === "string";
  }

  isFunctionType(val) {
    return typeof val === "function";
  }

  isDateType(val) {
    return val instanceof Date;
  }
}
