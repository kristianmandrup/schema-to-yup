export const json = {
  definitions: {},
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  title: "Entry Submit Schema",
  required: ["email"],
  additionalProperties: false,
  properties: {
    email: {
      type: "string",
      // pattern: "^\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}\\b$",
      enum: ["test@test.com", "my@email.com"],
      description: "Email Address"
    }
  }
};
