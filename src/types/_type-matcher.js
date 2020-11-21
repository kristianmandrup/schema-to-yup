export const typeMatcher = {
  isNothing(val) {
    return val === undefined || val === null;
  },
  isPresent(num) {
    return !typeMatcher.isNothing(num);
  },
  toNumber(num) {
    return Number(num);
  },
  isNumberLike(num) {
    return !isNaN(typeMatcher.toNumber(num));
  },
  isObjectType(obj) {
    return obj === Object(obj);
  },
  isArrayType(value) {
    return Array.isArray(value);
  },
  isNumberType(num) {
    return !isNaN(num);
  },
  isStringType(val) {
    return typeof val === "string";
  },
  isFunctionType(val) {
    return typeof val === "function";
  },
  isDateType(val) {
    return val instanceof Date;
  }
}

