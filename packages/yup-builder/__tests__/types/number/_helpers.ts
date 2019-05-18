import { toNumber, toSchemaEntry, yup } from "./_imports";
const toYupNumber = toNumber;
const toYupNumberSchemaEntry = toSchemaEntry;

const isInteger = fieldDef =>
  fieldDef && (fieldDef.type === "int" || fieldDef.type === "integer");

const isNumber = fieldDef =>
  fieldDef && (fieldDef.type === "number" || isInteger(fieldDef));

const config = { isNumber, isInteger };

const createNum = value => {
  const obj = { value, config, key: "value", type: "number" };
  return toYupNumber(obj, config);
};

const createEntry = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupNumberSchemaEntry(obj, config);
};

const createNumEntry = value => {
  const obj = { value, config, key: "value", type: "number" };
  return toYupNumberSchemaEntry(obj, config);
};

const createIntEntry = value => {
  const obj = { value, config, key: "value", type: "int" };
  return toYupNumberSchemaEntry(obj, config);
};

const createNumNoKeyEntry = value => {
  const obj = { value, config, type: "number" };
  return toYupNumberSchemaEntry(obj, config);
};

const createSchema = value => {
  return yup.object().shape({
    value
  });
};

module.exports = {
  createNum,
  createEntry,
  createNumEntry,
  createIntEntry,
  createNumNoKeyEntry,
  createSchema,
  isInteger,
  isNumber,
  config
};
