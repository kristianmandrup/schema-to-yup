const { Loggable } = require("./_loggable");

class TypeMatcher extends Loggable {
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
    return this.isNumberType(this.toNumber(num));
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

  isArrayType(val) {
    return Array.isArray(val);
  }

  isDateType(val) {
    return val instanceof Date;
  }
}

module.exports = {
  TypeMatcher
};
