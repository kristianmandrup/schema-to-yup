# Schema to Yup schema

Build a Yup schema from a JSON Schema, GraphQL schema (type definition) or any other similar type/class and field/properties model or schema :)

- [AJV: JSON Schema keywords](https://ajv.js.org/keywords.html)
- [Learn JsonSchema](https://cswr.github.io/JsonSchema/)

The builder currently supports the most commonly used [JSON Schema layout](https://json-schema.org/) and GraphQL type definition exports using [graphSchemaToJson](https://github.com/kristianmandrup/graphSchemaToJson) (see [GraphQL schema](#graphql-schema)).

It also supports some extra convenience schema properties that make it more "smooth" to define validation requirements declaratively (see below).

According to the JSON schema specs, you are free to add extra metadata to the field schema definitions beyond those supported "natively".

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
    email: {
      type: "string",
      format: "email"
    },
    fooorbar: {
      type: "string",
      matches: "(foo|bar)"
    },
    age: {
      description: "Age of person",
      type: "number",
      exclusiveMinimum: 0,
      required: true
    },
    characterType: {
      enum: ["good", "bad"],
      enum_titles: ["Good", "Bad"],
      type: "string",
      title: "Type of people",
      propertyOrder: 3
    }
  },
  required: ["name", "email"]
};

const config = {
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

## Custom models

This library now also supports non JSON schema models. See the `types/defaults` mappings.

`types/defaults/json-schema.js`

```js
module.exports {
  getProps: obj => obj.properties,
  getType: obj => obj.type,
  getName: obj => obj.name || obj.title,
  getConstraints: obj => obj,
  isString: obj => obj.type === "string",
  isArray: obj => obj.type === "array",
  isInteger: obj => obj.type === "integer",
  isBoolean: obj => obj.type === "boolean",
  hasDateFormat: obj => ["date", "date-time"].find(t => t === obj.format),
  isDate: obj => obj.type === "string" && defaults.hasDateFormat(obj.format),
  isNumber: obj => obj.type === "number" || defaults.isInteger(obj.type),
  isObject: obj => obj.type === "object",
  isRequired: obj => obj.required
};
```

### GraphQL schema

To support another model, such as GraphQL schema (type definitions) via [graphSchemaToJson](https://github.com/kristianmandrup/graphSchemaToJson)

_Person_

```js
{
  Person: {
    name: 'Person',
    fields: {
      name: {
        type: 'String',
        directives: {
          constraints: {
            minLength: 2
          }
        },
        isNullable: false,
        isList: false
      }
    }
    directives: {},
    type: 'Object',
    implements: []
  }
}
```

Create a map of methods to match your model layout:

```js
const typeDefConf = {
  getProps: obj => obj.fields,
  getType: obj => obj.type,
  getName: obj => obj.name,
  getConstraints: obj => (obj.directives || {}).constraints || {},
  isString: obj => obj.type === "String",
  isArray: obj => obj.isList,
  isInteger: obj => obj.type === "Int",
  isBoolean: obj => obj.type === "Boolean",
  isDate: obj => obj.type === "Date" || obj.directives.date,
  isNumber: obj => obj.type === "Int" || obj.type === "Float",
  isObject: obj => obj.type === "Object",
  isRequired: obj => !obj.isNullable
};
```

Please note that `getConstraints` can be used to control where the constraints of the field will be taken from (depending on the type of model/schema or your preference).

Pass overrides to match your model in `config` as follows:

```js
const schema = buildYup(nameJsonSchema, { ...typeDefConf, log: true });
```

The type definition mappings above are already built-in and available.
To switch the schema type, pass `schemaType` in config as follows.

```js
const schema = buildYup(nameJsonSchema, { schemaType: "type-def", log: true });
```

Feel free to make PRs to make more common schema models conveniently available!

### Custom logs and error handling

You can enable logging py passing a `log` option in the `config` argument. If set to true, it will by default assign the internal log function to `console.log`

```js
const schema = buildYup(nameJsonSchema, { log: true });
```

You can also pass a log function in the `log` option to handle log messages and an `err` option with a custom error handler function.

See [Custom errors in Node](https://rclayton.silvrback.com/custom-errors-in-node-js) for how to design custom errors

```js
class ValidationError extends Error {}

const schema = buildYup(nameJsonSchema, {
  log: (name, msg) => console.log(`[${name}] ${msg}`)
  err: (msg) => {
    console.error(`[${name}] ERROR: ${msg}`
    throw new ValidationError(msg)
  })
});
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

### Extend Yup API to bridge other validators

You can use `extendYupApi` to extend the Yup API with extra validation methods:

```js
const validator = require("validator");
const { extendYupApi } = require("json-schema-to-yup/validator-bridge");

// by default extends with string format validation methods of validator
// See https://www.npmjs.com/package/validator
extendYupApi({ validator });
```

You can optionally pass in a custom `validator` and a constraints map of your choice.
You can either extend the default constraints or override them with your own map.

PS: Check out `src/validator-bridge` for more many options for fine control

```js
const myValidator = new MyValidator();
const constraints = ["creditCard", "currency", { name: "hash", opts: "algo" }];
extendYupApi({ validator: myValidator, override: true, constraints });

const { buildYup } = require("json-schema-to-yup");
// type def sample schema, using credit-card format validator
const schema = {
  name: "BankAccount",
  fields: {
    accountNumber: {
      type: "String",
      format: "credit-card"
    }
  }
};

// opt in to use generic string format validation, via format: true config option
const yupSchema = buildYup(schema, { format: true, schemaType: "type-def" });
// ...do your validation
const valid = await yupSchema.isValid({
  accountNumber: "123-4567-1828-2929"
});
```

Now the bridge includes tests. Seems to work ;)

### Subclassing

You can sublass `YupBuilder` or any of the internal classes to create your own custom infrastructure to suit your particular needs, expand with support for extra features etc.

```js
const { YupBuilder } = require("json-schema-to-yup");

class MyYupBuilder extends YupBuilder {
  // ... custom overrides etc
}

const builder = new MyYupBuilder(schema, config);
const { yupSchema } = builder;
// ...
```

### Error messages

You can pass an `errMessages` object in the optional `config` object argument with key mappings for your custom validation error messages.

Internally the validator error messages are resolved with the instance method `valErrMessage` (from `Mixed` class)

```js
  notOneOf() {
    const {not, notOneOf} = this.value
    const $oneOf = notOneOf || (not && (not.enum || not.oneOf))
    $oneOf && this
      .base
      .notOneOf($oneOf, this.valErrMessage('notOneOf'))
    return this
  }
```

The key entries can be either a function, taking a `value` argument or a static string.
Here are some of the defaults that you can override as needed.

```js
export const errValKeys = [
  "oneOf",
  "enum",
  "required",
  "notRequired",
  "minDate",
  "min",
  "maxDate",
  "max",
  "trim",
  "lowercase",
  "uppercase",
  "email",
  "url",
  "minLength",
  "maxLength",
  "pattern",
  "matches",
  "regex",
  "integer",
  "positive",
  "minimum",
  "maximum"
];

export const defaults = {
  errMessages: (keys = errValKeys) =>
    keys.reduce((acc, key) => {
      const fn = ({ key, value }) =>
        `${key}: invalid for ${value.name || value.title}`;
      acc[key] = fn;
      return acc;
    }, {})
};
```

### Custom validation messages using select defaults

```js
const { buildYup, types } = require("json-schema-to-yup");
const { defaults } = types;

const myErrMessages = require("./err-messages");
const valKeys = ["lowercase", "integer"];

// by default Yup built-in validation error messages will be used if not overridden here
const errMessages = {
  ...defaults.errMessages(valKeys),
  myErrMessages
};

const yupSchema = buildYup(json, {
  errMessages
});
```

## Adding custom constraints

See the `number` type for the current best practice to add type constraints.

For simple cases: use `addConstraint` from the superclass `YupMixed`

```js
  required() {
    return this.addConstraint("required");
  }
```

For types with several of these, we should map through a list or map to add them all.

```js
  strict() {
    return this.addValueConstraint("strict");
  }

  required() {
    return this.addConstraint("required");
  }

  notRequired() {
    return this.addConstraint("notRequired");
  }
```

Can be rewritten to use conventions, iterating a map:

```js
  addMappedConstraints() {
    Object.keys(this.constraintsMap).map(key => {
      const list = constraintsMap[key];
      const fnName = key === 'value' ? 'addValueConstraint' : 'addConstraint'
      list.map(this.[fnName]);
    });
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }
```

For more complex contraints that:

- have multiple valid constraint names
- require validation
- optional transformation

You can create a separate `Constraint` subclass, to offload and handle it all separately.
Here is a sample `RangeConstraint` used by number.

```js
class RangeConstraint extends NumericConstraint {
  constructor(typer) {
    super(typer);
  }

  get $map() {
    return {
      moreThan: ["exclusiveMinimum", "moreThan"],
      lessThan: ["exclusiveMaximum", "lessThan"],
      max: ["maximum", "max"],
      min: ["minimum", "min"]
    };
  }
}
```

Instead of wrapping a `Constraint` you can call it directly with a `map`

```js
// this would be an instance such as YupNumber
// map equivalent to $map in the RangeConstraint
range() {
  return createNumericConstraint(this, map);
}
```

For the core type constraint class (such as `YupNumber`) you should now be able to simplify it to:

```js
  get enabled() {
    return ["range", "posNeg", "integer"];
  }

  convert() {
    this.enabled.map(name => this.processConstraint(name));
    super.convert();
    return this;
  }
```

The following constraint classes are available for use:

- `NumericConstraint`
- `StringConstraint`
- `RegExpConstraint`
- `DateConstraint`

Currently only `YupNumber` has been (partly) refactored to take advantage of this new infrastructure. Please help refactor the rest!

`YupNumber` also has the most unit test coverage, used to test the current infrastructure!

## Similar projects

- [JSON schema to Elastic Search mapping](https://github.com/kristianmandrup/json-schema-to-es-mapping)
- [JSON Schema to GraphQL types with decorators/directives](https://github.com/kristianmandrup/json-schema-to-graphql-types-decorated)
- [JSON Schema to Mongoose schema](https://github.com/kristianmandrup/convert-json-schema-to-mongoose)
- [JSON Schema to MobX State Tree types](https://github.com/ralusek/jsonschema-to-mobx-state-tree)
- [Convert JSON schema to mongoose 5 schema](https://github.com/kristianmandrup/convert-json-schema-to-mongoose)

The library [JSON Schema model builder](https://github.com/kristianmandrup/json-schema-model-builder#readme) is a powerful toolset to build a framework to create any kind of output model from a JSON schema.

If you enjoy this declarative/generator approach, try it out!

## Testing

Uses [jest](jestjs.io/) for unit testing.

- Have unit tests that cover most of the constraints supported.
- Could use some refactoring using the latest infrastructure (see `NumericConstraint`)
- Please help add more test coverage and help refactor to make this lib even more awesome :)

## Development

Current development is taking place on [refactoring](https://github.com/kristianmandrup/json-schema-to-yup/tree/refactoring) branch.

On his branch:

- all the code has been converted to TypeScript
- constraint classes for String, Numeric, RegExp etc.
- Validator building has been extracted so you can add support for any Validator, such as Forg
- more...

If you would like to further improved this library or add support for more validators than Yup, please help on this branch. Cheers!

## Ideas and suggestions

Please feel free to come with ideas and suggestions on how to further improve this library.

## Author

2018 Kristian Mandrup (CTO@Tecla5)

## License

MIT

```

```
