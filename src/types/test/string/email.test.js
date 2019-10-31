import { createStr, createSchema } from "./_helpers";

const entryValidation = entry => {
  describe("validate", () => {
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
};

describe("email", () => {
  describe("create schema", () => {
    test("email", () => {
      expect(createStr({ email: true, key: "email" })).toBeTruthy();
    });

    test("format email", () => {
      expect(createStr({ format: "email", key: "email" })).toBeTruthy();
    });
  });

  describe("format: email", () => {
    const entry = createStr({ format: "email", key: "email" });

    entryValidation(entry);
  });

  describe("email: true", () => {
    const entry = createStr({ email: true, key: "email" });

    entryValidation(entry);
  });
});
