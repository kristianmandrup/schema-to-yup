export const hasDateContraint = obj => {
  return false;
};

export const isNothing = val => {
  return val === undefined || val === null;
};

export const isPresent = num => {
  return !this.isNothing(num);
};

export const toNumber = num => {
  return Number(num);
};

export const isNumberLike = num => {
  return this.isNumberType(this.toNumber(num));
};

export const isNumberType = num => {
  return !isNaN(num);
};

export const isString = type => {
  return type === "string";
};

export const isFunction = fun => {
  return typeof fun === "function";
};

export const isRegExpType = value => {
  return value instanceof RegExp;
};

export const isDateFormat = type => {
  return ["date", "date-time", "time"].find(t => t === type);
};

export const isDateType = val => {
  return val instanceof Date;
};

export const isDate = obj => {
  return isNumDate(obj) || isStrDate(obj);
};

export const isNumDate = obj => {
  return isInteger(obj.type) && (obj.date === true || isDateFormat(obj.format));
};

export const isStrDate = obj => {
  return (
    (obj.type === "string" && hasDateContraint(obj)) || isDateFormat(obj.format)
  );
};

export const stringify = obj => {
  return JSON.stringify(obj, null, 2);
};

export const safeToFloat = (num, defaultValue = 1) => {
  try {
    const parsed = Number.parseFloat(num);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  } catch (err) {
    return defaultValue;
  }
};

export const safeToInt = (num, defaultValue = 1) => {
  try {
    const parsed = Number.parseInt(num);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  } catch (err) {
    return defaultValue;
  }
};

export const keysOf = obj => Object.keys(obj);
export const isEmptyObj = obj => !obj || keysOf(obj).length === 0;

export const isInteger = type => {
  return type === "integer";
};

export const isStringType = val => {
  return typeof val === "string";
};

export const isNumber = type => {
  return type === "number" || isInteger(type);
};

export const isNumericRange = obj => {
  if (!obj.range === true) return false;
  const min = obj.minimum || obj.exclusiveMinimum;
  const max = obj.maximum || obj.exclusiveMaximum;
  return isNumber(obj.type) && safeToFloat(min) && safeToFloat(max);
};

export const isDateRange = obj => {
  if (!obj.range === true) return false;
  const min = obj.minimum || obj.exclusiveMinimum;
  const max = obj.maximum || obj.exclusiveMaximum;
  return isDate(obj.type) && safeToFloat(min) && safeToFloat(max);
};

export const isObjectType = obj => {
  return obj === Object(obj);
};

export const isArray = type => {
  return type === "array";
};

export const isArrayType = obj => {
  return Array.isArray(obj);
};

export const isObject = obj => {
  return obj === "object" || obj.type === "object"; // && isObjectType(obj.properties)
};

export const isReferenceArray = obj => {
  return isArray(obj.type) && isReference(obj);
};

export const isReference = obj => {
  return obj.reference === true;
};

export const isBoolean = type => {
  return type === "boolean";
};

export const schemaEntryTypeMap = {
  object: isObject,
  array: isArray,
  boolean: isBoolean,
  string: isString,
  number: isNumber,
  date: isDate
};

export const primitiveSchemaEntryTypeMap = {
  boolean: isBoolean,
  string: isString,
  number: isNumber,
  date: isDate
};

const primitiveTypeNames = ["boolean", "string", "number", "date"];

export const isPrimitiveType = type => primitiveTypeNames.includes(type);

export const schemaEntryMainType = (type?: string) => {
  switch (type) {
    case "array":
      return "array";
    case "object":
      return "object";
    default:
      return "primitive";
  }
};

export const schemaTypeOf = (entry: any = {}) => {
  const { type } = entry;
  const keys = Object.keys(schemaEntryTypeMap);
  return keys.find((key: string) => {
    const typeTestmethod = schemaEntryTypeMap[key];
    return typeTestmethod(type);
  });
};

export const schemaEntryMainTypeOf = (entry: any = {}) => {
  const { type } = entry;
  const schemaType = schemaTypeOf(type);
  return schemaEntryMainType(schemaType);
};

export const createAssign = map => (pos, value) => {
  map[pos] = value;
};

export const assignAt = (map, pos, value) => {
  map[pos] = value;
};

/**
 * string capitalization - first letter - capital, other - lowercase.
 * @param {String} word - Word or sentence.
 */
export const capitalize = word => {
  if (!isStringType(word)) {
    throw new Error(`capitalize: Invalid text ${word}`);
  }
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
};

import { classify, camelize } from "inflection";
const camelcase = camelize;

export { camelcase, classify, camelize };
