const { types } = require("../../src");
const { toYupNumber } = types;
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
  const obj = { value, config, key: "value", type: "number" };
  return toYupNumber(obj, config);
};

const createInt = value => {
  const obj = { value, config, key: "value", type: "int" };
  return toYupNumber(obj, config);
};

const createNumNoKey = value => {
  const obj = { value, config, type: "number" };
  return toYupString(obj, config);
};

const createSchema = value => {
  return yup.object().shape({
    value
  });
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
  describe("max", () => {
    describe("schema opts", () => {
      //test("bad string - ignored?", () => {
      //  expect(() => createNum({ max: "b" })).toThrow();
      //});

      test("number string - transformed?", () => {
        expect(() => createNum({ max: "1" })).not.toThrow();
      });

      test("negative number - ok", () => {
        expect(() => createNum({ max: -1 })).not.toThrow();
      });
    });

    describe("validate", () => {
      const arr = createNum({ max: 2 });
      const schema = createSchema(arr);

      test("less", () => {
        const valid = schema.isValidSync({
          value: 0
        });
        expect(valid).toBeTruthy();
      });

      test("equal - valid?", () => {
        expect(schema.isValidSync({ value: 2 })).toBeTruthy();
      });

      /*test("more", () => {
        const valid = schema.isValidSync({
          value: 5
        });
        expect(valid).toBeFalsy();
      });*/
    });
  });

  describe("min", () => {
    describe("schema opts", () => {
      /*test("bad string - ignored?", () => {
        expect(() => createNum({ min: "b" })).toThrow();
      });*/

      test("number string - transformed?", () => {
        expect(() => createNum({ min: "1" })).not.toThrow();
      });

      test("negative number - ok", () => {
        expect(() => createNum({ min: -1 })).not.toThrow();
      });
    });

    describe("validate", () => {
      const arr = createNum({ min: 2 });
      const schema = createSchema(arr);

      /*test("less", () => {
        const valid = schema.isValidSync({
          value: 0
        });
        expect(valid).toBeFalsy();
      });*/

      test("equal - not valid?", () => {
        expect(schema.isValidSync({ value: 2 })).toBeTruthy();
      });

      test("more", () => {
        const valid = schema.isValidSync({
          value: 5
        });
        expect(valid).toBeTruthy();
      });
    });
  });
});
