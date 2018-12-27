import { buildSchema } from "../";
import yup from "yup";

//check validity
describe("yup schema validation", () => {
  const name = yup.string().required();
  // console.log("yup entry", { name });
  const shapeConfig = {
    name
    // age: yup
    //   .number()
    //   .required()
    //   .positive()
  };
  // console.log("original shape config", { shapeConfig });
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
      name: { type: "string", required: true }
    }
  };

  const schema = buildSchema(nameJsonSchema);

  test("invalid json is invalid", async () => {
    const valid = schema.isValidSync({ blip: "jimmy" });
    expect(valid).toBe(false);
  });
});

test("converts JSON schema to Yup Schema and validates", async () => {
  const json = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://example.com/person.schema.json",
    title: "Person",
    description: "A person",
    type: "object",
    properties: {
      name: {
        description: "Name of the person",
        type: "string"
      },
      age: {
        description: "Age of person",
        type: "number",
        exclusiveMinimum: 0,
        required: true
      },
      peopleType: {
        enum: ["good", "bad"],
        enum_titles: ["Good", "Bad"],
        type: "string",
        title: "Type of people",
        propertyOrder: 4
      }
    },
    required: ["name"]
  };

  const errMessages = {};
  const schema = buildSchema(json, { errMessages });
  // console.dir(schema)
  const valid = await schema.isValid({ name: "jimmy", age: 24 });
  expect(valid).toBe(true);
});
