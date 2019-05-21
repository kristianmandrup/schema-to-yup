const getProps = obj => obj && obj.properties;
const getType = obj => obj && obj.type;
const getName = obj => (obj && obj.name) || obj.title;
const getConstraints = obj => obj;
const isString = obj => obj && obj.type === "string";

const isInteger = obj => (obj && obj.type === "integer") || obj.type === "int";
const isBoolean = obj => obj && obj.type === "boolean";

const isDate = obj => obj && obj.type === "string" && hasDateFormat(obj.format);
const isNumber = obj => obj && (obj.type === "number" || isInteger(obj));
const isArray = obj => obj && obj.type === "array";
const isObject = obj => obj && obj.type === "object";

const isRequired = obj => obj && obj.required;
const hasDateFormat = obj =>
  obj && ["date", "date-time"].find(t => t === obj.format);
const hasFormat = (obj: any, format: string) => obj && obj.format === format;

export const jsonSchema: any = {
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
