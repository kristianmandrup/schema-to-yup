const yup = require("yup");
const { types, buildYup } = require("../../../src");
const { toYupString } = types;

export { buildYup };

const isString = fieldDef => fieldDef && fieldDef.type === "string";
const config = { isString };

export const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupString(obj, config);
};

export const createStr = (value, key = "x") => {
  const obj = { value, config, key, type: "string" };
  console.log("createStr", obj);
  return toYupString(obj, config);
};

export const createStrNoKey = value => {
  const obj = { value, config, type: "string" };
  return toYupString(obj, config);
};

export const createSchema = (schemaEntry, label = "value") => {
  console.log({ schemaEntry });
  const { _whitelist } = schemaEntry;
  const list = _whitelist && _whitelist.list;
  console.log({ list });

  return yup.object().shape({
    [label]: schemaEntry
  });
};
