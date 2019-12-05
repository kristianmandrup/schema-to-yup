// additionalProperties: https://github.com/kristianmandrup/schema-to-yup/issues/55

const { buildYup } = require("../src");

describe.skip("models schema", () => {
  const modelsJsonSchema = {
    title: "models",
    type: "object",
    properties: {
      name: {
        type: "string",
        required: true
      },
      type: {
        type: "string",
        required: true
      }
    },
    additionalProperties: { type: "string" }
  };

  const schema = buildYup(modelsJsonSchema);

  test("invalid json is invalid", async () => {
    const valid = schema.isValidSync({
      type: "Person",
      name: "Administrator",
      level: 3, // invalid,
      color: "blue" // valid
    });
    expect(valid).toBe(false);
  });
});
