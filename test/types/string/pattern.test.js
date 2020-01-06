import { createStr, createSchema } from "./_helpers";

describe("pattern", () => {
  describe("create schema", () => {
    test("pattern", () => {
      expect(createStr({ pattern: /\w+/, key: "name" })).toBeTruthy();
    });
  });

  describe("validate no flags", () => {
    const entry = createStr({ pattern: "abc", key: "name" });
    const schema = createSchema(entry, "name");

    test("valid pattern", () => {
      const valid = schema.isValidSync({
        name: "abc"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid pattern", () => {
      const valid = schema.isValidSync({
        name: "@123"
      });
      expect(valid).toBeFalsy();
    });
  });

  describe("validate with flags", () => {
    const entry = createStr({ pattern: "abc", key: "name", flags: "i" });
    const schema = createSchema(entry, "name");

    test("valid pattern", () => {
      const valid = schema.isValidSync({
        name: "Abc"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid pattern", () => {
      const valid = schema.isValidSync({
        name: "@123"
      });
      expect(valid).toBeFalsy();
    });
  });
});
