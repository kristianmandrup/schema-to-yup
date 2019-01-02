const defaults = {
  getProps: obj => obj && obj.properties,
  getType: obj => obj && obj.type,
  getName: obj => (obj && obj.name) || obj.title,
  getConstraints: obj => obj,
  isString: obj => obj && obj.type === "string",
  isArray: obj => obj && obj.type === "array",
  isInteger: obj => (obj && obj.type === "integer") || obj.type === "int",
  isBoolean: obj => obj && obj.type === "boolean",
  hasDateFormat: obj =>
    obj && ["date", "date-time"].find(t => t === obj.format),
  isDate: obj =>
    obj && obj.type === "string" && defaults.hasDateFormat(obj.format),
  isNumber: obj => obj && (obj.type === "number" || defaults.isInteger(obj)),
  isObject: obj => obj && obj.type === "object",
  isRequired: obj => obj && obj.required
};

export default defaults;
