// see https://avro.apache.org/docs/current/spec.html

const defaults = {
  getProps: obj => obj && obj.fields,
  getType: obj => obj && obj.type,
  getName: obj => obj && (obj.name || obj.title),
  getConstraints: obj => obj,
  isString: obj => obj && obj.type === "string",
  isArray: obj => obj && obj.type === "array",
  isInteger: obj => obj && obj.type === "int",
  isFloat: obj => obj && obj.type === "float",
  isDouble: obj => obj && obj.type === "double",
  isBoolean: obj => obj && obj.type === "boolean",
  isDate: obj =>
    obj && obj.type === "int" && obj.logicalType === "date",
  isNumber: obj => obj && (defaults.isInteger(obj) || defaults.isFloat(obj) || defaults.isDouble(obj)),
  isObject: obj => obj && obj.type === "record",
  isRequired: obj => obj && obj.required
};

export default defaults;
