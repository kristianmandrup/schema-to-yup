const {
  createEntry,
  createNumEntry,
  createIntEntry,
  createNumNoKey,
  createSchema,
  isNumber
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

  test("entryay - %", () => {
    expect(createEntry([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(createEntry({ x: 2 })).toBeFalsy();
  });

  test("int object - ok", () => {
    expect(createIntEntry({})).toBeTruthy();
  });

  test("number object - ok", () => {
    expect(createNumEntry({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createNumNoKey({})).toThrow();
  });

  describe("max", () => {
    describe("schema opts", () => {
      test("bad string - ignored?", () => {
        expect(() => createNumEntry({ max: "b" })).toThrow();
      });

      test("number string - transformed?", () => {
        expect(() => createNumEntry({ max: "1" })).not.toThrow();
      });

      test("negative number - ok", () => {
        expect(() => createNumEntry({ max: -1 })).not.toThrow();
      });
    });

    describe("validate", () => {
      const entry = createNumEntry({ max: 2 });
      const schema = createSchema(entry);

      test("less", () => {
        const valid = schema.isValidSync({
          value: 0
        });
        expect(valid).toBeTruthy();
      });

      test("equal - valid?", () => {
        expect(schema.isValidSync({ value: 2 })).toBeTruthy();
      });

      test("more", () => {
        const valid = schema.isValidSync({
          value: 5
        });
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("min", () => {
    describe("schema opts", () => {
      test("bad string - throws", () => {
        expect(() => createNumEntry({ min: "b" })).toThrow();
      });

      test("number string - transformed", () => {
        expect(() => createNumEntry({ min: "1" })).not.toThrow();
      });

      test("negative number - ok", () => {
        expect(() => createNumEntry({ min: -1 })).not.toThrow();
      });

      test("handles zero - ok", () => {
        expect(() => createNumEntry({ min: 0 })).not.toThrow();
      });
    });

    describe("min - validate", () => {
      describe("min: 2", () => {
        const entry = createNumEntry({ min: 2 });
        const schema = createSchema(entry);

        test("less: invalid", () => {
          const valid = schema.isValidSync({
            value: 0
          });
          expect(valid).toBeFalsy();
        });

        test("equal: valid", () => {
          expect(schema.isValidSync({ value: 2 })).toBeTruthy();
        });

        test("more: valid", () => {
          const valid = schema.isValidSync({
            value: 5
          });
          expect(valid).toBeTruthy();
        });
      });

      describe("min: 0", () => {
        const entry = createNumEntry({ min: 0 });
        const schema = createSchema(entry);

        test("less: invalid", () => {
          const valid = schema.isValidSync({
            value: -1
          });
          expect(valid).toBeFalsy();
        });

        test("equal : valid", () => {
          expect(schema.isValidSync({ value: 0 })).toBeTruthy();
        });

        test("more: valid", () => {
          const valid = schema.isValidSync({
            value: 5
          });
          expect(valid).toBeTruthy();
        });
      });

      describe("min: -1", () => {
        const entry = createNumEntry({ min: -1 });
        const schema = createSchema(entry);

        test("less: invalid", () => {
          const valid = schema.isValidSync({
            value: -2
          });
          expect(valid).toBeFalsy();
        });

        test("equal: valid", () => {
          expect(schema.isValidSync({ value: -1 })).toBeTruthy();
        });

        test("more: valid", () => {
          const valid = schema.isValidSync({
            value: 0
          });
          expect(valid).toBeTruthy();
        });
      });
    });
  });
});
