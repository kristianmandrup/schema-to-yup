export const numberTypeMatcher = {
  toNumber(num) {
    return Number(num);
  },
  isNumberLike(num) {
    return !isNaN(typeMatcher.toNumber(num));
  },
  isNumberType(num) {
    return !isNaN(num);
  },
}

export const dateTypeMatcher = {
  toDate(date) {
    return new Date(date);
  },
  isDateType(val) {
    return val instanceof Date;
  }
}

export const typeMatcher = {
  isNothing(val) {
    return val === undefined || val === null;
  },
  isPresent(num) {
    return !typeMatcher.isNothing(num);
  },
  isEmpty(str) {
    return typeMatcher.isNothing(str) || str.trim() === ''
  },
  ...numberTypeMatcher,
  ...dateTypeMatcher,
  isObjectType(obj) {
    return obj === Object(obj);
  },
  isArrayType(value) {
    return Array.isArray(value);
  },
  isStringType(val) {
    return typeof val === "string";
  },
  isFunctionType(val) {
    return typeof val === "function";
  }
}

