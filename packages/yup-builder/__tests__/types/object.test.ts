import { types, yup } from "./_imports";
const { object } = types;
const { toSchemaEntry } = object;
const toYupObject = toSchemaEntry;

const isObject = fieldDef => fieldDef && fieldDef.type === "object";
const config = { isObject };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupObject(obj, config);
};

const createObject = value => {
  const obj = { value, config, key: "x", type: "object" };
  return toYupObject(obj, config);
};

const createObjectNoKey = value => {
  const obj = { value, config, type: "object" };
  return toYupObject(obj, config);
};

describe("toYupObject", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createObject({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createObjectNoKey({})).toThrow();
  });
});
