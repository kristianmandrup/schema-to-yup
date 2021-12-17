import { createStr, createSchema } from "./_helpers";

describe("oneOf", () => {
  describe("schema opts", () => {
    test("string array - ok", () => {
      expect(() => createStr({ oneOf: ["2"] })).not.toThrow();
    });

    test.only("negative - ok", () => {
      expect(() => createStr({ oneOf: -1 })).not.toThrow();
    });
  });

  describe("validate", () => {
    const entry = createStr({ oneOf: ["male", "female"], key: "gender" });
    const schema = createSchema(entry, "gender");

    test("valid", () => {
      const valid = schema.isValidSync({ gender: "male" });
      expect(valid).toBeTruthy();
    });

    test("invalid", () => {
      const valid = schema.isValidSync({ gender: "animal" });
      expect(valid).toBeFalsy();
    });
  });
});
