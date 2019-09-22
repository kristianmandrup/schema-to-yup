import { createStr, createSchema } from "./_helpers";

describe("notOneOf", () => {
  describe("schema opts", () => {
    test("string array - ok", () => {
      expect(() => createSchema({ notOneOf: ["2"] })).not.toThrow();
    });

    test("negative - ok", () => {
      expect(() => createSchema({ notOneOf: -1 })).not.toThrow();
    });

    // test("null - throws", () => {
    //   expect(() => createSchema({ notOneOf: null })).toThrow();
    // });
  });

  describe("validate", () => {
    const entry = createStr({ notOneOf: ["male", "female"], key: "gender" });
    const schema = createSchema(entry, "gender");

    test("invalid", () => {
      const valid = schema.isValidSync({ gender: "male" });
      expect(valid).toBeFalsy();
    });

    test("valid", () => {
      const valid = schema.isValidSync({ gender: "animal" });
      expect(valid).toBeTruthy();
    });
  });
});
