const { types } = require("../../src");
const { toYupDate } = types;

const isDate = fieldDef => fieldDef && fieldDef.type === "date";
const config = { isDate };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupDate(obj, config);
};

const createDate = value => {
  const obj = { value, config, key: "x", type: "date" };
  return toYupDate(obj, config);
};

const createDateNoKey = value => {
  const obj = { value, config, type: "date" };
  return toYupDate(obj, config);
};

describe("toYupDate", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createDate({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createDateNoKey({})).toThrow();
  });
});
