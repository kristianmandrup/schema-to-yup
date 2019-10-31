import { createStr, createSchema } from "./_helpers";

describe("maxLength", () => {
  const conf = { maxLength: 4, key: "name" };
  describe("create schema", () => {
    test("maxLength", () => {
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
        name: "zxy124"
      });
      expect(valid).toBeFalsy();
    });
  });
});
