const { buildYup } = require("../src");

test("converts person JSON schema to Yup Schema and validates", async () => {
  const personSchema = {
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
  const schema = buildYup(personSchema, { errMessages });
  // console.dir(schema)
  try {
    const valid = await schema.isValid({ name: "jimmy", age: 24 });
    expect(valid).toBe(true);  
  } catch (e) {
    console.log(e)
  }
});