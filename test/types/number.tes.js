const yup = require("../src");
const { toYupNumber } = yup.types;

const isNumber = fieldDef => fieldDef && fieldDef.type === "number";
const isInteger = fieldDef => fieldDef && fieldDef.type === "int";
const config = { isNumber, isInteger };

const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupNumber(obj, config);
};

const createNum = value => {
  const obj = { value, config, key: "x", type: "number" };
  return toYupNumber(obj, config);
};

const createInt = value => {
  const obj = { value, config, key: "x", type: "int" };
  return toYupNumber(obj, config);
};

describe("toYupNumber", () => {
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

  test("int object - ok", () => {
    expect(() =>
      create({ type: "number", key: "age", value: {} })
    ).not.toThrow();
  });

  test("number object - ok", () => {
    expect(() =>
      create({ type: "number", key: "age", value: {} })
    ).not.toThrow();
  });
});
