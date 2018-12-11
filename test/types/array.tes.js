const { types } = require("../");
const { toYupArray } = types;

const isArray = fieldDef => fieldDef && fieldDef.type === "array";
const config = { isArray };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupArray(obj, config);
};

describe("toYupArray", () => {
  test("null - %", () => {
    expect(() => create(null)).toThrow();
  });
  test("string - %", () => {
    expect(() => create("x")).toThrow();
  });

  test("number - %", () => {
    expect(() => create(1)).toThrow();
  });

  test("array - %", () => {
    expect(() => create([1])).toThrow();
  });

  test("object - %", () => {
    expect(() => create({ x: 2 })).toThrow();
  });

  test("string object - % missing key and value", () => {
    expect(() => create({ type: "string" })).toThrow();
  });

  test("array object - ok", () => {
    expect(() =>
      create({ type: "array", key: "roles", value: {} })
    ).not.toThrow();
  });
});
