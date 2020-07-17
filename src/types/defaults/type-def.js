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

const defaults = typeDefConf;
// {
//   getProps: obj => obj && obj.fields,
//   getType: obj => obj && obj.type,
//   getName: obj => obj && obj.name,
//   getConstraints: obj => (obj && (obj.directives || {}).constraints) || {},
//   isString: obj => obj && obj.type === "String",
//   isArray: obj => obj && obj.isList,
//   isInteger: obj => obj && obj.type === "Int",
//   isBoolean: obj => obj && obj.type === "Boolean",
//   isDate: obj => (obj && obj.type === "Date") || obj.directives.date,
//   isNumber: obj => (obj && obj.type === "Int") || obj.type === "Float",
//   isObject: obj => obj && obj.type === "Object",
//   isRequired: obj => obj && !obj.isNullable
// };

export default defaults;
