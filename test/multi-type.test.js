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
  describe("simple - string and null", () => {
    const modelsJsonSchema = {
      title: "models",
      type: "object",
      properties: {
        name: ["string", "null"]
      }
    };

    const schema = buildYup(modelsJsonSchema);

    describe("valid", () => {
      test("null name", async () => {
        const valid = schema.isValidSync({ name: null });
        expect(valid).toBe(true);
      });

      test("string name", async () => {
        const valid = schema.isValidSync({ name: "x" });
        expect(valid).toBe(true);
      });
    });

    describe("invalid", () => {
      test("missing name", async () => {
        const valid = schema.isValidSync({ blip: "jimmy" });
        expect(valid).toBe(false);
      });

      test("name is number", async () => {
        const valid = schema.isValidSync({ name: 2 });
        expect(valid).toBe(false);
      });
    });
  });

  describe("complex", () => {
    const modelsJsonSchema = {
      title: "models",
      type: "object",
      properties: {
        name: [{
          type: "string",
          minLength: 2
        }, {
          type: "string",
          pattern: '[a-zA-Z_]+'          
        }]
      }
    };

    const schema = buildYup(modelsJsonSchema);

    describe("valid", () => {
      test("name length 2", async () => {
        const valid = schema.isValidSync({ name: '12' });
        expect(valid).toBe(true);
      });

      test("alpha numeric length 1", async () => {
        const valid = schema.isValidSync({ name: "x" });
        expect(valid).toBe(true);
      });
    });

    describe("invalid", () => {
      test("missing name", async () => {
        const valid = schema.isValidSync({ blip: "jimmy" });
        expect(valid).toBe(false);
      });

      test("name is empty string", async () => {
        const valid = schema.isValidSync({ name: '' });
        expect(valid).toBe(false);
      });
    });
  });
  });
});
