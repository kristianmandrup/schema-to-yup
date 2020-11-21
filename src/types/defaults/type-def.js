const typeDefConf = {
  getProps: (obj) => obj.properties,
  getType: (obj) => obj.type,
  getName: (obj) => obj.name || obj.title,
  getConstraints: (obj) => obj,
  isString: (obj) => obj.type === "string" && !typeDefConf.hasDateFormat(obj),
  isArray: (obj) => obj.type === "array",
  isBoolean: (obj) => obj.type === "boolean",
  isInteger: (obj) => obj.type === "integer",
  hasDateFormat: (obj) => ["date", "date-time"].includes(obj?.value?.format), // using nullish coalescing
  isDate: (obj) => obj.type === "string" && typeDefConf.hasDateFormat(obj),
  isNumber: (obj) => obj.type === "number" || typeDefConf.isInteger(obj),
  isObject: (obj) => obj.type === "object",
  isRequired: (obj) => obj.required,
};

export default typeDefConf;
