# JSON Schema to Yup schema

Simple JSON Schema to Yup validation Schema conversion

[JSON Schema primer](https://support.riverbed.com/apis/steelscript/reschema/jsonschema.html)

Supports the most commonly used JSON Schema layout.
Also supports some extra convenience schema properties that make it more "smooth" to define validation requirements declaratively (see below).

Note that is you use these extra properties, the JSON Schema is no longer valid if used in a context where JSON Schema validation is performed.

We will likely later support normalization and de-normalization.

```js
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
    }
  },
  required: ["name"]
};

const json2yup = require("json-schema-to-yup");

const yupSchema = json2yup(json);
// console.dir(schema)
const valid = await yupSchema.isValid({
  name: "jimmy",
  age: 24
});

console.log({
  valid
});
// => {valid: true}
```

This would generate the following Yup validation schema:

```js
const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup
    .number()
    .required()
    .positive()
});
```

Note the `"required": true` for the `age` property (not natively supported by JSON schema).

## Complex example

Here a more complete example of the variations currently possible

```json
{
  "title": "Person",
  "description": "A person",
  "type": "object",
  "properties": {
    "name": {
      "description": "Name of the person",
      "type": "string",
      "required": true,
      "matches": "[a-zA-Z- ]+",
      "mix": 3,
      "maxLength": 40
    },
    "age": {
      "description": "Age of person",
      "type": "integer",
      "min": 0,
      "max": 130,
      "required": false
    },
    "birthday": {
      "type": "date",
      "min": "1-1-1900",
      "maxDate": "1-1-2015"
    },
    "smoker": {
      "type": "boolean"
    },
    "mother": {
      "type": "object",
      "properties": {}
    },
    "siblings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {}
      }
    }
  }
}
```

## License

MIT
