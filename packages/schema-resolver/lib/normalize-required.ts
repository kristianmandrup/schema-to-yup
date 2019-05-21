export const normalizeRequired = schema => {
  let { properties, required } = schema;
  required = required || [];
  return Object.keys(properties).reduce((acc, key) => {
    const value = properties[key];
    const isRequired = required.indexOf(key) >= 0;
    value.required = value.required || isRequired;
    acc[key] = value;
    return acc;
  }, {});
};
