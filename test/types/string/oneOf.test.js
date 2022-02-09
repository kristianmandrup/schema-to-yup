import { createStr, createSchema } from "./_helpers";

describe("oneOf", () => {
  describe("schema opts", () => {
    test("string array - ok", () => {
      expect(() => createStr({ oneOf: ["2"] })).not.toThrow();
    });

    test("negative - ok", () => {
      expect(() => createStr({ oneOf: [-2] })).not.toThrow();
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


describe("inner schemas with const", () => {
  const entry = createStr({ oneOf: [{const: "male"}, {const: "female"}], key: "gender" });
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