const {
  createSchema,
  createIntEntry,
  createIntegerEntry,
  isNumber,
} = require("./_helpers");
const { buildYup } = require("../../../src");

describe("isNumber", () => {
  test("int", () => {
    expect(isNumber({ type: "int" })).toBeTruthy();
  });

  test("integer", () => {
    expect(isNumber({ type: "integer" })).toBeTruthy();
  });
});

describe("toYupNumber", () => {
  test("int object - ok", () => {
    expect(createIntEntry({})).toBeTruthy();
  });

  test("integer object - ok", () => {
    expect(createIntegerEntry({})).toBeTruthy();
  });

  test("integer min object - ok", () => {
    expect(createIntegerEntry({})).toBeTruthy();
  });

  describe("min int - validate", () => {
    describe("min: 2", () => {
      const entry = createIntEntry({ min: 2 });
      const schema = createSchema(entry);

      test("not int: invalid", () => {
        const valid = schema.isValidSync({
          value: 0.5,
        });
        expect(valid).toBeFalsy();
      });

      test("less: invalid", () => {
        const valid = schema.isValidSync({
          value: 0,
        });
        expect(valid).toBeFalsy();
      });

      test("more than min: valid", () => {
        const valid = schema.isValidSync({
          value: 3,
        });
        expect(valid).toBeTruthy();
      });
    });
  });

  describe("min integer - validate", () => {
    describe("min: 2", () => {
      const entry = createIntegerEntry({ min: 2 });
      const schema = createSchema(entry);

      test("not int: invalid", () => {
        const valid = schema.isValidSync({
          value: 1.5,
        });
        expect(valid).toBeFalsy();
      });

      test("less: invalid", () => {
        const valid = schema.isValidSync({
          value: 0,
        });
        expect(valid).toBeFalsy();
      });

      test("more than min: valid", () => {
        const valid = schema.isValidSync({
          value: 3,
        });
        expect(valid).toBeTruthy();
      });
    });
  });
});

describe("Integer schema test", () => {
  let yupSchema;
  beforeEach(() => {
    const buildSchema = (type) => ({
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        age: {
          type: "int",
        },
      },
    });

    yupSchema = {
      int: buildYup(buildSchema("int")),
      integer: buildYup(buildSchema("int")),
    };
  });

  test("int schema - not valid", () => {
    const isValid = yupSchema.int.isValidSync({
      age: 39.5,
    });
    expect(isValid).toBeFalsy();
  });

  test.skip("integer schema - not valid", () => {
    const isValid = yupSchema.integer.isValidSync({
      age: 39.5,
    });
    expect(isValid).toBeFalsy();
  });
});
