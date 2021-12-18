const { buildYup } = require("../src");

var yup = require("yup");

//check validity
describe("yup schema validation", () => {
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

describe("name schema", () => {
  const nameJsonSchema = {
    title: "users",
    type: "object",
    properties: {
      name: {
        type: "string",
        required: true
      }
    }
  };

  const schema = buildYup(nameJsonSchema);

  test("invalid json is invalid", async () => {
    try {
      const valid = schema.isValidSync({ blip: "jimmy" });
      expect(valid).toBe(false);
    }
    catch (e) {
      console.log(e)
    }
  });
});

