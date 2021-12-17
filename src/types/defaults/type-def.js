const defaults = {
  getProps: obj => obj && obj.fields,
  getType: obj => obj && obj.type,
  getName: obj => obj && obj.name,
  getConstraints: obj => (obj && (obj.directives || {}).constraints) || {},
  isString: obj => obj && obj.type === "String",
  isArray: obj => obj && obj.isList,
  isInteger: obj => obj && obj.type === "Int",
  isBoolean: obj => obj && obj.type === "Boolean",
  isDate: obj => (obj && obj.type === "Date") || obj.directives.date,
  isNumber: obj => (obj && obj.type === "Int") || obj.type === "Float",
  isObject: obj => obj && obj.type === "Object",
  isRequired: obj => obj && !obj.isNullable
};

export default defaults;
