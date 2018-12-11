const { types } = require("../../src");
const { toYupArray } = types;

const isArray = fieldDef => fieldDef && fieldDef.type === "array";
const config = { isArray };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupArray(obj, config);
};

const createArr = value => {
  const obj = { value, config, key: "x", type: "array" };
  return toYupArray(obj, config);
};

const createArrNoKey = value => {
  const obj = { value, config, type: "array" };
  return toYupArray(obj, config);
};

describe("toYupArray", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });
  test("string - %", () => {
    expect(create("x")).toBeFalsy();
  });

  test("number - %", () => {
    expect(create(1)).toBeFalsy();
  });

  test("array - %", () => {
    expect(create([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(create({ x: 2 })).toBeFalsy();
  });

  test("string object - %", () => {
    expect(create({ type: "string" })).toBeFalsy();
  });

  test("array object - ok", () => {
    expect(() => createArr({})).toBeTruthy();
  });

  test("array object - ok", () => {
    expect(() => createArrNoKey({})).toThrow();
  });
});
