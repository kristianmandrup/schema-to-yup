const { buildYup } = require("../src");

var yup = require("yup");

//check validity
describe("yup multi type schema validation", () => {
  const name = yup.string().required();
  const shapeConfig = {
    name
  };
  const schema = yup.object().shape(shapeConfig);

  test("valid json is valid", async () => {
    // , age: 24
    const valid = await schema.isValid({ name: "jimmy" });
    expect(valid).toBe(true);
  });

  test("invalid json is invalid", async () => {
    const valid = await schema.isValid({ blip: "jimmy", age: 24 });
    expect(valid).toBe(false);
  });
});

describe("multi type JSON schema", () => {
  const modelsJsonSchema = {
    title: "models",
    type: "object",
    properties: {
      name: ["string", "null"]
    }
  };

  const schema = buildYup(modelsJsonSchema);

  test("invalid json is invalid", async () => {
    const valid = schema.isValidSync({ blip: "jimmy" });
    expect(valid).toBe(false);
  });
});
