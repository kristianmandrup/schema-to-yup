module.exports = {
  getProps: obj => obj.properties,
  getType: obj => obj.type,
  getName: obj => obj.name || obj.title,
  isString: obj => obj.type === "string",
  isArray: obj => obj.type === "array",
  isInteger: obj => obj.type === "integer",
  isBoolean: obj => obj.type === "boolean",
  hasDateFormat: obj => ["date", "date-time"].find(t => t === obj.format),
  isDate: obj => obj.type === "string" && defaults.hasDateFormat(obj.format),
  isNumber: obj => obj.type === "number" || defaults.isInteger(obj.type),
  isObject: obj => obj.type === "object",
  isRequired: obj => obj.required
};
