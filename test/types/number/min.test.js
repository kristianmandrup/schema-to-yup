const { createNumEntry, createSchema } = require("./_helpers");

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
