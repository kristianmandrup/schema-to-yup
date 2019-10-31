import { createStr, createSchema } from "./_helpers";
const json = {
  definitions: {},
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "Entry Submit Schema",
  required: ["email"],
  additionalProperties: false,
  properties: {
    email: {
      type: "string",
      pattern: "^\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b$",
      enum: ["test@test.com", "my@email.com"],
      description: "Email Address"
    }
  }
};

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
  });
});
