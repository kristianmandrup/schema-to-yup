import { createStr, createSchema } from "./_helpers";

describe("minLength", () => {
  const conf = { minLength: 4, key: "name" };
  describe("create schema", () => {
    test("minLength", () => {
      expect(createStr(conf)).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr(conf);
    const schema = createSchema(entry, "name");

    test("valid name", () => {
      const valid = schema.isValidSync({
        name: "abcde"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid name", () => {
      const valid = schema.isValidSync({
        name: "zxy"
      });
      expect(valid).toBeFalsy();
    });
  });
});
