import { YupMixed } from "../../../src/types/mixed";

export const toYupMixed = opts => new YupMixed(opts);

const config = {};

const createEntry = (fieldDef = {}) => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupMixed(obj, config);
};

export { YupMixed, createEntry };
