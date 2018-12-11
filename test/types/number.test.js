const yup = require("../../src");
const { toYupNumber } = yup.types;
const yup = require("yup");

const isInteger = fieldDef =>
  fieldDef && (fieldDef.type === "int" || fieldDef.type === "integer");

const isNumber = fieldDef =>
  fieldDef && (fieldDef.type === "number" || isInteger(fieldDef));
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

const createNumNoKey = value => {
  const obj = { value, config, type: "number" };
  return toYupString(obj, config);
};

describe("isNumber", () => {
  test("int", () => {
    expect(isNumber({ type: "int" })).toBeTruthy();
  });

  test("integer", () => {
    expect(isNumber({ type: "integer" })).toBeTruthy();
  });

  test("number", () => {
    expect(isNumber({ type: "number" })).toBeTruthy();
  });
});

describe("toYupNumber", () => {
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

  test("int object - ok", () => {
    expect(createInt({})).toBeTruthy();
  });

  test("number object - ok", () => {
    expect(createNum({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createNumNoKey({})).toThrow();
  });
});
