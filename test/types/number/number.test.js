const {
  createEntry,
  createNumEntry,
  createIntEntry,
  createIntegerEntry,
  createNumNoKey,
  isNumber,
} = require("./_helpers");

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
    expect(createEntry(null)).toBeFalsy();
  });

  test("string - %", () => {
    expect(createEntry("x")).toBeFalsy();
  });

  test("number - %", () => {
    expect(createEntry(1)).toBeFalsy();
  });

  test("entry - %", () => {
    expect(createEntry([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(createEntry({ x: 2 })).toBeFalsy();
  });

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

  test("number object - ok", () => {
    expect(createNumEntry({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createNumNoKey({})).toThrow();
  });
});
