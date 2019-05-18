import { types, yup } from "./_imports";
const { boolean } = types;
const { toSchemaEntry } = boolean;
const toYupBoolean = toSchemaEntry;

const isBoolean = fieldDef => fieldDef && fieldDef.type === "boolean";
const config = { isBoolean };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupBoolean(obj, config);
};

const createBool = value => {
  const obj = { value, config, key: "x", type: "boolean" };
  return toYupBoolean(obj, config);
};

const createBoolNoKey = value => {
  const obj = { value, config, type: "boolean" };
  return toYupBoolean(obj, config);
};

describe("toYupBoolean", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createBool({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createBoolNoKey({})).toThrow();
  });
});
