const { createNumberGuard } = require("./_imports");

const isInteger = fieldDef =>
  fieldDef && (fieldDef.type === "int" || fieldDef.type === "integer");

const isNumber = fieldDef =>
  fieldDef && (fieldDef.type === "number" || isInteger(fieldDef));

const config = { isNumber, isInteger };

const createGuard = value => {
  const obj = { value, config, key: "value", type: "number" };
  return createNumberGuard(obj, config);
};

describe("createNumberGuard", () => {
  describe("create: no args", () => {
    const guard = createNumberGuard();
    test("config: default object", () => {
      const { config } = guard;
      expect(typeof config).toEqual("object");
    });

    test("configured with defaults", () => {
      expect(typeof guard.log).toEqual("function");
    });

    test("object: undefined", () => {
      expect(guard.obj).toBeUndefined();
    });

    test("isValid: false", () => {
      expect(guard.isValid()).toBeFalsy();
    });
  });

  test("null- %", () => {
    expect(createNumberGuard(null)).toBeTruthy();
  });

  test("obj, no config", () => {
    expect(createNumberGuard({})).toBeTruthy();
  });

  describe("valid number entry", () => {
    const guard = createGuard({ max: "1" });
    test("isValid", () => {
      expect(guard.isValid()).toBeTruthy();
    });

    test("verify", () => {
      expect(guard.verify()).toBeTruthy();
    });
  });
});
