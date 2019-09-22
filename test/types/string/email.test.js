import { createStr, createSchema } from "./_helpers";

describe("email", () => {
  describe("create schema", () => {
    test("email", () => {
      expect(createStr({ email: true, key: "email" })).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr({ email: true, key: "email" });
    const schema = createSchema(entry, "email");

    test("valid email", () => {
      const valid = schema.isValidSync({
        email: "a@b.com"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid email", () => {
      const valid = schema.isValidSync({
        email: "zxy@"
      });
      expect(valid).toBeFalsy();
    });
  });
});
