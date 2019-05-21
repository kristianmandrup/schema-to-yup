const getProps = obj => obj && obj.fields;
const getType = obj => obj && obj.type;
const getName = obj => obj && obj.name;
const getConstraints = obj => (obj && (obj.directives || {}).constraints) || {};
const isString = obj => obj && obj.type === "String";
const isArray = obj => obj && obj.isList;
const isInteger = obj => obj && obj.type === "Int";
const isBoolean = obj => obj && obj.type === "Boolean";
const isDate = obj => (obj && obj.type === "Date") || obj.directives.date;
const isNumber = obj => (obj && obj.type === "Int") || obj.type === "Float";
const isObject = obj => obj && obj.type === "Object";
const isRequired = obj => obj && !obj.isNullable;
const hasFormat = (obj: any, format: string) => obj && obj.directives[format];
const hasDateFormat = obj => false;

export const graphQLTypeDef: any = {
  getProps,
  getType,
  getName,
  getConstraints,
  isString,
  isInteger,
  isBoolean,
  isDate,
  isNumber,
  isArray,
  isObject,
  isRequired,
  hasDateFormat,
  hasFormat
};
