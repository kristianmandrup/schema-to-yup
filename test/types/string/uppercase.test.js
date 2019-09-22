import { createStr, createSchema } from "./_helpers";

describe("uppercase - strict", () => {
  const conf = { uppercase: true, strict: true, key: "name" };
  describe("create schema", () => {
    test("uppercase", () => {
      expect(createStr(conf)).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr(conf);
    const schema = createSchema(entry, "name");

    test("valid name", () => {
      const valid = schema.isValidSync({
        name: "ACV"
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
