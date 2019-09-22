import { createStr, createSchema } from "./_helpers";

describe("lowercase - strict", () => {
  const conf = { lowercase: true, strict: true, key: "name" };
  describe("create schema", () => {
    test("lowercase", () => {
      expect(createStr(conf)).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr(conf);
    const schema = createSchema(entry, "name");

    test("valid name", () => {
      const valid = schema.isValidSync({
        name: "abc"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid name", () => {
      const valid = schema.isValidSync({
        name: "AXDadf"
      });
      expect(valid).toBeFalsy();
    });
  });
});
