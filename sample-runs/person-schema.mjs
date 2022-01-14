import { buildYup } from "../dist/index.js";
// import { buildYup } from "../src/index.js";

const schema = {
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

const config = {
  logging: true,
  logDetailed: [{
    propName: 'exclusiveMinimum',
    key: 'age'
  }],
  // for error messages...
  errMessages: {
    age: {
      required: "A person must have an age"
    },
    email: {
      required: "You must enter an email address",
      format: "Not a valid email address"
    }
  }
};
const yupSchema = buildYup(schema, config);
// console.dir(schema)
yupSchema
  .isValid({
    name: "jimmy",
    age: 24
  })
  .then(
    (valid) =>
      console.log({
        valid
      })
    // => NOT {valid: true}
  );

yupSchema
  .validate({
    name: "jimmy",
    age: 24
  })
  .then(
    (valid) =>
      console.log({
        valid
      })
    // => NOT {valid: true}
  )
  .catch((error) => {
    console.error(error);
  });
