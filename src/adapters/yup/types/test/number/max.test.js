const { createNumEntry, createSchema } = require("./_helpers");

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
