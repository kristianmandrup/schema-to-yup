module.exports = {
  getProps: obj => obj.fields,
  getType: obj => obj.type,
  getName: obj => obj.name,
  getConstraints: obj => (obj.directives || {}).constraints,
  isString: obj => obj.type === "String",
  isArray: obj => obj.isList,
  isInteger: obj => obj.type === "Int",
  isBoolean: obj => obj.type === "Boolean",
  isDate: obj => obj.type === "Date" || obj.directives.date,
  isNumber: obj => obj.type === "Int" || obj.type === "Float",
  isObject: obj => obj.type === "Object",
  isRequired: obj => !obj.isNullable
};
