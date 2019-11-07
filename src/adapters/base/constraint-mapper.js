import camelcase from "camelcase";

const hasApplyMethod = (clazz = clazz.prototype && clazz.prototype.apply);

const error = (clazz, opts) => {
  const { key } = opts;
  const msg = `constraint class for ${key} invalid: missing apply method`;
  console.error(msg, { clazz, opts });
  throw msg;
};

const defaults = {
  constraintFactoryFn: (typeHandler, opts = {}) => {
    const { clazz, key } = opts;
    hasApplyMethod(clazz, opts) ? new clazz(typeHandler).apply() : error(clazz);
  }
};

export const constraintsFor = (constraintClassesMap, opts = {}) => {
  const constraintClassNames = Object.keys(constraintClassesMap);
  const constraintFactoryFn =
    defaults.constraintFactoryFn || opts.constraintFactoryFn;
  // export const createNoUnknown =

  return constraintClassNames.reduce((acc, name) => {
    const key = camelcase(name);
    const clazz = constraintClasses[name];
    acc[key] = typeHandler =>
      constraintFactoryFn(typeHandler, { clazz, name, key });
    return acc;
  }, {});
};
