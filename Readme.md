# JSON Schema to Yup schema

Build a Yup schema from a JSON Schema :)

- [AJV: JSON Schema keywords](https://ajv.js.org/keywords.html)
- [Learn JsonSchema](https://cswr.github.io/JsonSchema/)

The builder currently supports the most commonly used JSON Schema layout.

It also supports some extra convenience schema properties that make it more "smooth" to define validation requirements declaratively (see below).

Note that if you use these extra properties, the JSON Schema is no longer valid if used in a context where JSON Schema validation is performed.

We could later support normalization and de-normalization of a JSON Schema (if requested by the community).

## Quick start

Install

`npm install json-schema-to-yup -S` or `yarn add json-schema-to-yup`

Use

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

## Types and keys

### Mixed (any type)

- `strict`
- `default`
- `nullable`
- `required`
- `notRequired`
- `oneOf` (`enum`)
- `notOneOf`

### Array

- `ensure`
- `compact`
- `items` (`of`)
- `maxItems` (`max`)
- `minItems` (`min`)

### Boolean

No keys

### Date

- `maxDate` (`max`)
- `minDate` (`min`)

### Number

- `integer`
- `moreThan` (`exclusiveMinimum`)
- `lessThan` (`exclusiveMaximum`)
- `positive`
- `negative`
- `min` (`minimum`)
- `max` (`maximum`)
- `truncate`
- `round`

### Object

- `camelCase`
- `constantCase`
- `noUnknown` (`propertyNames`)

### String

- `minLength` (`min`)
- `maxLength` (`max`)
- `pattern` (`matches` or `regex`)
- `email` (`format: 'email'`)
- `url` (`format: 'url'`)
- `lowercase`
- `uppercase`
- `trim`

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
      "maxLength": 40,
    },
    "age": {
      "description": "Age of person",
      "type": "integer",
      "moreThan": 0,
      "max": 130,
      "default": 32,
      "required": false,
      "nullable": true
    },
    "birthday": {
      "type": "date",
      "min": "1-1-1900",
      "maxDate": "1-1-2015"
    },
    "married": {
      "type": "boolean"
    },
    "boss": {
      "type": "object",
      "noUnknown": [
        "name"
      ],
      "properties": {
        "name": {
          "type": "string",
          "notOneOf": ["Dr. evil", "bad ass"]
        }
      }
    },
    "colleagues": {
      "type": "array",
      "items": {
        "type": "object",
        "propertyNames": [
          "name"
        ],
        "properties": {
          "name": {
            "type": "string"
          }
        }
      }
    },
    "programming": {
        "type": "object",
        "properties": {
          "languages": {
            "type": "array",
            "of": {
              "type": "string",
              "enum": ["javascript", "java", "C#"]
            },
            "min": 1,
            "max": 3
          }
        }
      }
    }
  }
}
```

## Customization

You can supply a `createYupSchemaEntry` function as an entry in the `config` object.
This function will then be used to build each Yup Schema entry in the Yup Schema being built.

Use the Yup Type classes such as `types.YupArray` to act as building blocks or create your own custom logic as you see fit.

### Customization example

```js
const { YupSchemaEntry, buildYup, types } = require("json-schema-to-yup");

class CustomYupArray extends types.YupArray {
  // ...
}

class CustomYupSchemaEntry extends YupSchemaEntry {
  // ...
}

function createYupSchemaEntry(key, value, config) {
  const builder = new CustomYupSchemaEntryBuilder(key, value, config);
  builder.types.array = config => createYupArray(config);
  return builder.toEntry();
}

// use some localized error messages
const messages = i18n.locale(LOCALE);

const yupSchema = buildYup(json, {
  createYupSchemaEntry,
  messages
});
```

## Testing

Uses [jest](jestjs.io/) for unit testing.

Currently not well tested. Please help add more test coverage :)

## Author

2018 Kristian Mandrup (CTO@Tecla5)

## License

MIT
