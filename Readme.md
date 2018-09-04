# JSON Schema to Yup schema

Simple JSON Schema to Yup validation Schema conversion

- [AJV: JSON Schema keywords](https://ajv.js.org/keywords.html)
- [Learn JsonSchema](https://cswr.github.io/JsonSchema/)

The builder currently supports the most commonly used JSON Schema layout.

It also supports some extra convenience schema properties that make it more "smooth" to define validation requirements declaratively (see below).

Note that if you use these extra properties, the JSON Schema is no longer valid if used in a context where JSON Schema validation is performed.

We will likely later support normalization and de-normalization of a JSON Schema as well if requested by the community.

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

const config = {
  // for error messages...
  messages: {
    age: {
      required: "a person must have an age"
      // ...
    }
  }
};

const { buildYup } = require("json-schema-to-yup");
const yupSchema = buildYup(json, config);
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

Note: Currently we don't have much support for Array and Object validation.

## Customization

You can supply a `createYupSchemaEntry` function as an entry in the `config` object.
This function will then be used to build each Yup Schema entry in the Yup Schema being built.
Use the Type classes such as `types.YupArray` to act as building blocks or create your own custom logic as you see fit.

```js
const { YupSchemaEntry, buildYup, types } = require("json-schema-to-yup");

class CustomYupArray extends types.YupArray {
  // ...
}

class CustomYupSchemaEntry extends YupSchemaEntry {
  // ...

  toYupArray() {
    // create CustomYupArray
  }
}

function createYupSchemaEntry(key, value, config) {
  return new CustomYupSchemaEntry(key, value, config).toEntry();
}

// use some localized error messages
const messages = i18n.locale(LOCALE);

const yupSchema = buildYup(json, {
  createYupSchemaEntry,
  messages
});
```

## Author

2018 Kristian Mandrup (CTO@Tecla5)

## License

MIT
