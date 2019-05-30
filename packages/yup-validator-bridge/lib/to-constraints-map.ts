export const toConstraintsMap = (values: any[] = [], opts: any = {}) => {
  if (!Array.isArray(values)) {
    throw "toConstraintsMap: must take an array of values";
  }
  return values.reduce((acc, value) => {
    if (typeof value !== "string" && !(value instanceof Object)) {
      if (opts.throws !== false) {
        throw `toConstraintsMap: invalid entry ${value}`;
      } else {
        return acc;
      }
    }
    if (typeof value === "string") {
      acc[value] = {};
    } else {
      if (!value.name) {
        if (opts.throws !== false) {
          throw `toConstraintsMap: invalid entry ${value} missing name`;
        } else {
          return acc;
        }
      }
      acc[value.name] = value;
    }
    return acc;
  }, {});
};
