import camelcase from "camelcase";

const constraintsFor = constraintClassesMap => {
  const constraintClassNames = Object.keys(constraintClassesMap);

  // export const createNoUnknown =

  return constraintClassNames.reduce((acc, name) => {
    const key = camelcase(name);
    const clazz = constraintClasses[name];
    acc[key] = typeHandler => new clazz(typeHandler).apply();
    return acc;
  }, {});
};
