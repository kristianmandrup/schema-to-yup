import { createStr, createSchema } from "../_helpers";
import { json } from "./fixtures";

describe("enum", () => {
  const conf = { ...json.properties.email, key: "email" };
  const entry = createStr(conf);
  const schema = createSchema(entry, "email");

  describe("create schema", () => {
    test("enum", () => {
      expect(schema).toBeTruthy();
    });
  });

  describe("validate", () => {
    test("valid email (first in enum)", () => {
      const valid = schema.isValidSync({
        email: "test@test.com"
      });
      expect(valid).toBeTruthy();
    });

    test("valid email (last in enum)", () => {
      const valid = schema.isValidSync({
        email: "my@email.com"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid email (not in enum)", () => {
      const valid = schema.isValidSync({
        email: "abc@blip.com"
      });
      expect(valid).toBeFalsy();
    });

    test("invalid email - not an email", () => {
      const valid = schema.isValidSync({
        email: "abc"
      });
      expect(valid).toBeFalsy();
    });
  });
});
