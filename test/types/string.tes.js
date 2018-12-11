const { types } = require("../src");
const { toYupString } = types;

const isString = fieldDef => fieldDef && fieldDef.type === "string";
const config = { isString };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupString(obj, config);
};

describe("toYupString", () => {
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

  test("int object - %", () => {
    expect(create({ type: "number" })).toBeFalsy();
  });

  test("string object - ok", () => {
    expect(create({ type: "string", key: "name", value: {} })).toBeTruthy();
  });
});
