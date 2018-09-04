const {
  buildYup
} = require('../');

var yup = require('yup');

//check validity
test('yup validates values via Yup schema', async () => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    age: yup
      .number()
      .required()
      .positive()
  });
  const valid = await schema
    .isValid({
      name: 'jimmy',
      age: 24,
    })
  expect(valid).toBe(true)
})

test('converts JSON schema to Yup Schema and validates', async () => {
  const json = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/person.schema.json",
    "title": "Person",
    "description": "A person",
    "type": "object",
    "properties": {
      "name": {
        "description": "Name of the person",
        "type": "string"
      },
      "age": {
        "description": "Age of person",
        "type": "number",
        "exclusiveMinimum": 0,
        required: true
      }
    },
    "required": ["name"]
  }

  const schema = buildYup(json)
  // console.dir(schema)
  const valid = await schema
    .isValid({
      name: 'jimmy',
      age: 24,
    })
  expect(valid).toBe(true)

});
