# Advanced config

### GraphQL schema

GraphQL type definition exports using [graphSchemaToJson](https://github.com/kristianmandrup/graphSchemaToJson) (see [GraphQL schema](#graphql-schema)).

### Avro schema

Recently basic [Avro](https://avro.apache.org/docs/current/spec.html) schema support has been added as well.

### <a name='CustomAlternativeschemas'></a>Custom/Alternative schemas

You can easily add support for your own custom schema formats.

We also supports some extra convenience schema properties that make it more "smooth" to define validation requirements declaratively (see below).

According to the JSON schema specs, you are free to add extra metadata to the field schema definitions beyond those supported "natively".

## <a name='CustomAlternativevalidators'></a>Custom/Alternative validators

You can supply your own pre-configured global Yup instance to be used as a base.

You can also use the building blocks of this library to support alternative validators other than Yup.

See [Supporting alternative validators](#supporting-alternative-validators)

## <a name='Customizationhooks'></a>Customization hooks

This library is built to be easy to customize or extend to suit individual developer needs.
|Use any of the following customization hooks to add custom features, circumvent missing functionality or bugs or extend any way you see fit. You can even use these hooks to support a different validator library, leveraging the generic schema validator builder infrastructure.

- [Custom builder](#custom-builder)
- [Custom builder functions](#custom-builder-functions)
- [entry builders](#custom-entry-builders)
- [type handlers](#custom-type-handlers)
- [constraint handler functions](#custom-constraint-handler-functions)
- [constraint builder](#custom-constraint-builder)

## <a name='Confirmpassword'></a>Confirm password

You can use the special `refValue` constraint for password confirmation scenarios.

```js
  "password": {
    "minLength": 6,
    "type": "string"
  },
  "confirmPassword": {
    "refValue": "password",
    "type": "string"
  }
```

See the sample test case in `test/confirm-password.test.js`

## <a name='Multi-typeconstraints'></a>Multi-type constraints

A sample implementation to support multi type constraints has been implemented in `MultiPropertyValueResolver`.

To improve or customize support for this, you can pass a custom factory method `createMultiTypeValueResolver` on the `config` object and build on or improve the current implementation.

## <a name='Avoidingcyclicaldependencies'></a>Avoiding cyclical dependencies

The Yup validator may cause cyclical dependency error. This can be mitigated by supplying a deendencies array as decribed in this [Yup issue](https://github.com/jquense/yup/issues/176#issuecomment-369925782)

The yup builder lets you supply a `dependenciesMap` on the `config` object where the key for each entry is the key of an object or `root` for the root schema object.

```js
const config = {
  dependenciesMap: {
    root: [
      ["a", "b", "c"],
      ["b", "c", "d"],
    ],
    b: [["a", "z"]],
  },
};
```

It is currently implemented as follows in the `YupBuilder`

```js
  createDependenciesArray() {
    const key = this.key || "root";
    const dependenciesMap = this.config.dependenciesMap || {};
    const dependencies = dependenciesMap[key] || [];
    return dependencies;
  }
```

## <a name='Custombuilder'></a>Custom builder

To customize the builder to suit your needs, simply subclass the `YupBuilder` class and create your own factory function which instantiates your subclass.

```js
class MyCustomYupBuilder extends YupBuilder {
  init(schema, config)
    // my pre-init
    super.init(schema, config)
    // my post init
  }

  // my other overrides
}

export function buildYup(schema, config = {}) {
  return new MyCustomYupBuilder(schema, {...config}).yupSchema;
}
```

## <a name='Custombuilderfunctions'></a>Custom builder functions

- `init`
- `buildProperties`
- `buildProp`
- `setRequired`
- `setPropEntry`

### <a name='Custominit'></a>Custom init

You can supply a custom `init` function on the `config` object to do custom initialization. The `init` function will be bound to the `YupBuilder` instance so that `this` returns the builder instance.

```js
import * as yup from "yup";

const yupSchema = buildYup(jsonSchema, {
  init: (schema, config) {
    if (config.locale) yup.setLocale(config.locale);
    console.log({properties: this.properties})
  },
});
```

### <a name='CustombuildProperties'></a>Custom buildProperties

You can override the built-in `buildProperties` method (see code below) by supplying a custom `buildProperties` function on the `config` object.

```js
  buildProperties() {
    const propKeys = Object.keys(this.properties);
    const buildProp = (this.config.buildProp || this.buildProp).bind(this)
    return propKeys.reduce(buildProp, {});
  }
```

### <a name='CustombuildProp'></a>Custom buildProp

You can override the built-in `buildProp` method (see code below) by supplying a custom `buildProp` function on the `config` object.

```js
buildProp(propObj, key) {
    const value = this.properties[key];
    const required = this.getRequiredPropsList();
    const setRequired = (this.config.setRequired || this.setRequired).bind(this)
    // normalize required for prop
    setRequired(value, key, required)
    // set schema property entry
    const setPropEntry = (this.config.setPropEntry || this.setPropEntry).bind(this)
    setPropEntry(propObj, key, value)
    return propObj;
  }
```

### <a name='CustomsetRequired'></a>Custom setRequired

You can override the built-in `setRequired` method (see code below) by supplying a custom `setRequired` function on the `config` object.

```js
  // normalize required for prop
  setRequired(value, key, required) {
    const isRequired = required.indexOf(key) >= 0;
    if (!isObjectType(value)) {
      this.warn(`Bad property value: ${value} must be an object`);
    }
    value.required = this.isRequired(value) || isRequired;
    return value
  }
```

### <a name='CustomsetPropEntry'></a>Custom setPropEntry

You can override the built-in `setPropEntry` method (see code below) by supplying a custom `setPropEntry` function on the `config` object.

```js
  setPropEntry(propObj, key, value) {
    // order so required errors will be first
    propObj[key] = {
      required: value.required,
      ...value,
    }
  }
```

## <a name='Customentrybuilders'></a>Custom entry builders

You can pass in custom functions for the following kinds of type entry values

- object value, such as `{type: 'string'}`
- list value, such as `["string", "integer"]`

The custom functions are:

- `toSingleType(yupSchemaEntryBuilder)`
- `toMultiType(yupSchemaEntryBuilder)`

Each takes an instance `yupSchemaEntryBuilder` of `YupSchemaEntry`, which primarily holds the following properties of interest, that you can leverage in your custom handler logic

```js
{
  schema, key, name, value, type, obj, config;
}
```

### <a name='Customtypehandlers'></a>Custom type handlers

You can pass any custom type handlers in a `typeHandlers` object as part of the `config` object passes. See `setTypeHandlers()` and `get typeHandlers()` in `entry.js` for how this works internally.

```js
function myCustomStringHandler = (obj, config) => {
  // ... custom handler
  // return yup type schema such as yup.string()
  // with one or more constraints added
}

const yupSchema = buildYup(jsonSchema, {
  typeHandlers: {
    string: myCustomStringHandler
  },
});
```

This can be used to support special cases:

- to circumvent a bug
- add or override with custom functionality
- extend to add additional type handlers, such as for Avro schema
- add support for validators other than Yup

The following is the "Generic" TypeHandler (ie. `YupMixed`) which is the base class for all built-in type handlers.

```js
class GenericTypeHandler {
  constructor(opts = {}) {
    super(opts.config);
    this.init(opts);
  }

  init(opts) {
    let { schema, key, value, config, entryHandler } = opts;
    // ...
    this.key = key;
    this.schema = schema;
    this.properties = schema.properties || {};
    this.value = value;
    this.typeConstraintObj = this.value;
    this.title = value.title;
    this.description = value.description;
    this.constraints = this.getConstraints();
    this.format = value.format || this.constraints.format;
    this.config = config || {};
    this.type = this.baseType;
    // ...
  }
  // ...
}
```

The `constraints` property contains the type constraint object, the `value` contains the raw constraints.

You will need to at minimum implement a `validatorInstance` getter or property, such as:

```js
  get validatorInstance() {
    return yup
  }
```

#### <a name='Customarraytypehandler'></a>Custom array type handler

Currently this library has minimal support for the `array` type. To add better `array` type support, create a custom type handler for handling array types and use it as follows.

```js
const yupSchema = buildYup(jsonSchema, {
  typeHandlers: {
    array: myCustomArrayHandler,
  },
});
```

Use the `array.test.js` file for testing improved array support. Currently many of the array tests are marked with `skip`.

`$ npm test toYupArray`

### <a name='Additionaltypehandlers'></a>Additional type handlers

In order to pass a a type handler map that does not rely on any built in type handlers, pass in a `types` object

```js
const yupSchema = buildYup(jsonSchema, {
  types: {
    bytes: myCustomBytesHandler,
    // more handlers
  },
});
```

You can use the built in type handler classes as building blocks.

To control which constraints are enabled (executed), simply edit the `typeEnabled` getter on your type handler class. Here is the default `typeEnabled` getter for the `YupDate` (Date) type handler, which is configured to execute constraint handler functions: `minDate` and `maxDate`.

```js
  get typeEnabled() {
    return ["minDate", "maxDate"];
  }
```

A simpler alternative is to add custom constraint functions to the handlers as described in the next section.

### <a name='Customconstrainthandlerfunctions'></a>Custom constraint handler functions

You can add custom constraint handler functions directly via the `config` object.
This can be used to override built in constraints or extend with your own.

A custom handler to validate a string formatted as a valid `ip` address might look something like this (presuming such a method is available on `yup` string). You can also use this with [yup schema type extensions](https://github.com/jquense/yup#extending-schema-types).

```js
// takes the typehandler (such as YupString) instance as argument
const ipHandler = (th) => {
  const constraintName = th.constraintNameFor("ip", "format");
  const method = "ip";
  th.addConstraint("ip", {
    constraintValue: true,
    constraintName,
    method,
    errName: method,
  });
};

const config = {
  string: {
    convert: {
      ip: ipHandler,
    },
    enabled: [
      "ip", // custom
      // built in
      "normalize",
      "minLength",
      "maxLength",
      "pattern",
      "lowercase",
      "uppercase",
      "email",
      "url",
      "genericFormat",
    ],
  },
  // ... more configuration
};

buildYup(jsonSchema, config);
```

Instead of using enabled with the full list, you can also use `extends`

```js
    extends: [
      // custom additions
      "ip",
      // built in handlers all included automatically
    ]
```

Note that if `convert` has entries and `extends` for the type configuration is not set (and no `enabled` list of constraints defined either) it will use all the entries in `convert` by default (ie. `extends` set to all keys).

We welcome feedback on how to better structure the `config` object to make it easy and intuitive to add run-time configuration to suit your needs.

You can use this approach to add base level entry handlers via `mixed` which is the base handler for any specific type handler such as for `string` and `number`.

Here we are replacing the `label` handler with our custom handler implementation which uses `description` if available.

```js
const mixed = {
  enabled: [
    "oneOf",
    "notOneOf",
    "when",
    "nullable",
    "isType",
    // "label", not enabled
    // custom
    "my-custom-label" // enabled
  },
  convert: {
    "my-custom-label": (th) =>
      const value = th.value;
      const label = value.title || value.label || value.description;
      return th.apply('label', label)
    }
  }
}

const yupSchema = buildYup(jsonSchema, { mixedEnabled }
```

#### <a name='Advancedcustomconstraintexample'></a>Advanced custom constraint example

```js
const oneOfConditional = (th) => {
  let { config, parentNode, isObjectType, value, key } = th;
  // optionally set custom errMsg
  const oneOfConstraints = value;
  th.base = th.base.test(
    key,
    // errMsg,
    (value, context) => {
      for (let constraint in oneOfConstraints) {
        if (!isObjectType(constraint)) {
          return value === constraint;
        }
        const yupSchema = config.buildYup(constraint, config, parentNode);
        const result = yupSchema.validate();
        if (result) return true;
      }
      return false;
    }
  );
};

const notOneOfConditional = (th) => {
  let { config, parentNode, isObject, value, key } = th;
  // optionally set custom errMsg
  const oneOfConstraints = value;
  th.base = th.base.test(
    key,
    // errMsg,
    (value, context) => {
      for (let constraint in oneOfConstraints) {
        if (!isObject(constraint)) {
          return value !== constraint;
        }
        const yupSchema = config.buildYup(constraint, config, parentNode);
        const result = yupSchema.validate();
        if (result) return false;
      }
      return true;
    }
  );
};

const mixed = {
  convert: {
    oneOf: oneOfConditional,
    notOneOf: notOneOfConditional,
  },
};
```

### <a name='Custompipelinesteps'></a>Custom pipeline steps

The conversion pipeline supports pre and post processing to allow for custom functionality, such as preparing or overriding the built-in convert or circumvent bugs.

```js
  createSchemaEntry() {
    this.preConvert();
    this.convert();
    this.postConvert();
    return this.base;
  }
```

You can add `preConvert` and `postConvert` functions to the `config` such as in this example, where the `label` constraint is executed explicitly to ensure it is applied to the final yup schema for any property.

```js
const config = {
  postConvert(th) {
    th.label();
  },
};
```

### <a name='Customconstraintbuilder'></a>Custom constraint builder

This library supports using a custom constraint builder to add and build constraints. All factories are initialized in `initHelpers` and executed as the first step of `convert` (see `mixed.js`)

```js
import { ConstraintBuilder } from "schema-to-yup";

class MyConstraintBuilder extends ConstraintBuilder {
  constructor(typeHandler, opts = {}) {
    super(typeHandler, opts);
    // custom instance configuration
  }

  build(propName, opts) {
    /// custom build logic

    // returns new type validation handler (base) with built constraint added
    return newBase;
  }

  addConstraint(propName, opts) {
    // custom add constraint logic
    return this.typeHandler;
  }

  // custom event handler
  onConstraintAdded({ name, value }) {
    // ...
    return this.typeHandler;
  }
}
```

To use a custom constraint builder we recommend subclassing the `ConstraintBuilder` class that comes with the library. Then create a factory method thart can instanciate it.

```js
const createConstraintBuilder = (typeHandler, config) => {
  return new MyConstraintBuilder(typeHandler, config);
};

const config = {
  createConstraintBuilder,
  // ... more configuration
};

buildYup(jsonSchema, config);
```

## <a name='Supportingalternativevalidators'></a>Supporting alternative validators

Supply a `validator` instance (or getter function) on the `config` object which returns an instance of the validator you wish to use.

Optionally supply a `validatorFor` function on the config that returns a specific validator to be used for a given type handler.

```js
  init(...) {
    this.validator = this.getValidator()
    //
    this.base = this.getBase()
  }

  getBase() {
    return this.customBaseValidator || this.validatorInstance;
  }

  getValidator() {
    return this.opts.validator || this.builder.validator || yup;
  }
```

Subclass all the built-in type handlers, such as `YupString` and override the following key methods:

```js
  get baseType() {
    return "string";
  }

  get validatorInstance() {
    return this.validator.string();
  }
```

Then create a new `types` type handler mapping object and pass it via the `types` entry on the `config` object

```js
class MyCustomValidatorStringHandler extends YupString {
  get validatorInstance() {
    return this.validator.fieldHandlerFor("string");
  }
}

buildYup(jsonSchema, {
  types: {
    string: MyCustomValidatorStringHandler,
    // ...
  },
});
```

Subclass `YupBuilder` and override the `yupSchema` getter method and optionally the `setLocale` method as well

```js
  get yupSchema() {
    return yup.object().shape(this.shapeConfig);
  }

  setLocale() {
    this.config.locale && yup.setLocale(this.config.locale);
  }
```

Something like this

```js
const validatorSingleton = new MyValidator()

class MyCustomBuilder extends YupBuilder {
  init(schema, config)
    super.init(schema, config)
  }

  get validator() {
    return validatorSingleton
  }

  get yupSchema() {
    return this.validator.buildSchema();
  }
}
```

You can access the `entryHandler` and from there the `builder` from within a type handler via `this.entryHandler.builder`

So you can access a `validator` instance set in the builder via `this.entryHandler.validator` (note: should normally be a singleton instance)

Then do further customizations as needed.

## <a name='Conditionallogic'></a>Conditional logic

Basic support for [when conditions](https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema) as requested and outlined in [this issue](https://github.com/kristianmandrup/schema-to-yup/issues/14) is now included.

Work will continue in the [when-condition](https://github.com/kristianmandrup/schema-to-yup/tree/when-condition) branch.

Sample schema using simple `when` constraint:

```js
const biggyJson = {
  title: "biggy",
  type: "object",
  properties: {
    isBig: {
      type: "boolean",
    },
    count: {
      type: "number",
      when: {
        isBig: {
          is: true,
          then: {
            min: 5,
          },
        },
      },
    },
  },
};
```

Sample valid and invalid values with respect to `biggyJson` schema

```js
const bigJson = {
  valid: {
    isBig: true,
    count: 5, // since isBig is set, must be >= 5
  },
  invalid: {
    isBig: true,
    count: 4, // since isBig is set, must be >= 5
  },
};
```

Currently basic support is included in `1.10.x` on [npmjs](https://www.npmjs.com)

More advanced conditionals support will likely be included the next major release: `2.0`.

You are welcome to continue the effort to support more conditional schema logic by continuing on this branch and making PRs.

Support for `if` `then` and `else` [conditional JSON schema constraints](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.6) can likely be added using an approach like the `when` condition (perhaps by transalating to equivalent: `when`, `then` and `otherwise`).

- `if` - This keyword's value MUST be a valid JSON Schema
- `then` - This keyword's value MUST be a valid JSON Schema
- `else` - This keyword's value MUST be a valid JSON Schema

See also [json-schema-spec](https://github.com/json-schema-org/json-schema-spec/issues/180)

### 8.1. <a name='Customizingconditionallogic'></a>Customizing conditional logic

You can now also override, extend or customize the `when` condition logic by passing in your own factory method for the config object entry `createWhenCondition`

```js
const myWhenConditionFactoryFn = (opts = {}) => {
  const { type, key, value, when, schema, properties, config } = opts;
  // ...
};

const config = {
  createWhenCondition: myWhenConditionFactoryFn,
};
const schema = buildYup(nameJsonSchema, config);
```

The best and easiest way to do this is to extend the `WhenCondition` class which contains most of the necessary infrastructure you can further build on.

See the `src/conditions/legacy` folder for the legacy `1.9.0` logic that works but has limited functionality.

## <a name='Additionalproperties'></a>Additional properties

Currently this library does not have built-in support for the `additionalProperties` feature of JSON schema as described [here](https://json-schema.org/understanding-json-schema/reference/object.html)

```js
{
  "type": "object",
  "properties": {
    "number":      { "type": "number" },
    "street_name": { "type": "string" },
    "street_type": { "type": "string",
                     "enum": ["Street", "Avenue", "Boulevard"]
                   }
  },
  "additionalProperties": { "type": "string" }
}
```

See [issue 55](https://github.com/kristianmandrup/schema-to-yup/issues/55#issuecomment-561127144)

Yup does not directly support this, so it would require some "hacking" to make it work.

You can extend `YupBuilder` to include custom logic to support `additionalProperties`

```js
class YupBuilderWithSupportForAdditionalProperties extends YupBuilder {
  additionalPropsToShape(opts, shape) {
    // do your magic here using this.additionalProps
    // make new yup constraint function calls on the incoming yup shape object
    return shape;
  }
}
```

See the issue for ideas and hints on how to achieve support for this.

## <a name='Complexexample'></a>Complex example

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
      "min": 3,
      "maxLength": 40
    },
    "age": {
      "description": "Age of person",
      "type": "integer",
      "moreThan": 0,
      "max": 130,
      "default": 32,
      "required": false,
      "null": true
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
      "noUnknown": ["name"],
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
        "propertyNames": ["name"],
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
```

### 10.1. <a name='ComplexNestedschemas'></a>Complex/Nested schemas

Nested object schema properties are supported.

See `test/types/object/complex-schema.test.js`

## 11. <a name='Custommodels'></a>Custom models

This library now also supports non JSON schema models. See the `types/schema-parser-maps` mappings.

`types/schema-parser-maps/json-schema.js`

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

This can be used to support any kind of schema, including JSN schema and GraphQL type definition schemas etc.

### 11.1. <a name='GraphQLschema'></a>GraphQL schema

To support another model, such as GraphQL schema (type definitions) via [graphSchemaToJson](https://github.com/kristianmandrup/graphSchemaToJson)

Person:

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
  getProps: (obj) => obj.fields,
  getType: (obj) => obj.type,
  getName: (obj) => obj.name,
  getConstraints: (obj) => (obj.directives || {}).constraints || {},
  isString: (obj) => obj.type === "String",
  isArray: (obj) => obj.isList,
  isInteger: (obj) => obj.type === "Int",
  isBoolean: (obj) => obj.type === "Boolean",
  isDate: (obj) => obj.type === "Date" || obj.directives.date,
  isNumber: (obj) => obj.type === "Int" || obj.type === "Float",
  isObject: (obj) => obj.type === "Object",
  isRequired: (obj) => !obj.isNullable,
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

## Avro schema

Simply use `schemaType: "avro"` in the config object.

```js
const schema = buildYup(nameJsonSchema, { schemaType: "avro", log: true });
```

## 12. <a name='Othercustomschemaformatsupport'></a>Other/custom schema format support

You can supply a `config.schemaParserMap` object with parser entries for any specific schema formats you wish to support.

```js
const mySchemaParserMap = {
  "my-schema": {
    // ...
    isArray: (obj) => obj && obj.type === "list",
    // ...
  },
};

const schema = buildYup(nameJsonSchema, {
  schemaType: "my-schema",
  mySchemaParserMap,
});
```

You can eaven extend and override an existing entry in the map as follows, using the special `extends` key

```js
const mySchemaParserMap = {
  "my-schema": {
    extends: "avro",
    isArray: (obj) => obj && obj.type === "list",
    // ...
  },
};
```

You can supply a custom `createSchemaParserBuilder` entry in the `config` object to further customize the building of a `SchemaParser` using this map.

Feel free to make PRs to make more common schema models available!

### 12.1. <a name='Customlogsanderrorhandling'></a>Custom logs and error handling

You can enable logging py passing a `log` option in the `config.enable` object. If set to `true`, it will by default assign the internal log function to `console.log`
You can enable/disable warnings in a similar fashion with `enable.warn`

```js
const schema = buildYup(nameJsonSchema, { enable: { log: true, warn: true } });
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

Logging can also be enabled simply by passing `logging:true`. In addition, detailed logging can be enabled for specific matches, such as whenever a combination of a specific `key`, `propName` and `method` are encountered by the `ConstraintBuilder`

```js
{
  logging: true,
  logDetailed: [{
    propName: 'exclusiveMinimum', // property name in JSON schema
    key: 'age' // key in JSON schema
  }, {
    method: 'lessThan' // method that propName is resolved to
  }],
  logTypes: ['array', 'number']
```

You can also use the `logTypes` setting to enable logging only for certain type handlers. Please mot that this currently only affects calls to `logTypeInfo`

```js
{
  logging: true,
  logTypes: ['array', 'number']
```

This type of logging is only enabled for the `array` type handler at present, but you can add this type of logging as needed when/if you create your own type handlers.

```js
this.logTypeInfo("array:of", { schemaConf });
const schemaEntry = this.createYupSchemaEntry(schemaConf);
this.logTypeInfo("array:of", { schemaEntry });
```

## 13. <a name='Localizederrormessages'></a>Localized error messages

You can specify the locale to use in the `config` object.
Internally the builder will use the following `yup` call: `yup.setLocale(config.locale)`

Thanks [@gabrielburich](https://github.com/gabrielburich)

## 14. <a name='Customization'></a>Customization

You can supply a `createYupSchemaEntry` function as an entry in the `config` object.
This function will then be used to build each Yup Schema entry in the Yup Schema being built.

Use the Yup Type classes such as `types.YupArray` to act as building blocks or create your own custom logic as you see fit.

### 14.1. <a name='Customizationexample'></a>Customization example

```js
const { YupSchemaEntry, buildYup, types } = require("schema-to-yup");

class CustomYupArray extends types.YupArray {
  // ...
}

class CustomYupSchemaEntry extends YupSchemaEntry {
  // ...
}

function createYupSchemaEntry(key, value, config) {
  const builder = new CustomYupSchemaEntryBuilder(key, value, config);
  builder.types.array = (config) => createYupArray(config);
  return builder.toEntry();
}

// use some localized error messages
const messages = i18n.locale(LOCALE);

const yupSchema = buildYup(json, {
  createYupSchemaEntry,
  messages,
});
```

### 14.2. <a name='ExtendYupAPItobridgeothervalidators'></a>Extend Yup API to bridge other validators

You can use `extendYupApi` to extend the Yup API with extra validation methods:

```js
const validator = require("validator");
const { extendYupApi } = require("schema-to-yup/validator-bridge");

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

const { buildYup } = require("schema-to-yup");
// type def sample schema, using credit-card format validator
const schema = {
  name: "BankAccount",
  fields: {
    accountNumber: {
      type: "String",
      format: "credit-card",
    },
  },
};

// opt in to use generic string format validation, via format: true config option
const yupSchema = buildYup(schema, { format: true, schemaType: "type-def" });
// ...do your validation
const valid = await yupSchema.isValid({
  accountNumber: "123-4567-1828-2929",
});
```

Now the bridge includes tests and seems to work ;)

### 14.3. <a name='Subclassing'></a>Subclassing

You can sublass `YupBuilder` or any of the internal classes to create your own custom infrastructure to suit your particular needs, extend with extra features etc.

```js
const { YupBuilder } = require("schema-to-yup");

class MyYupBuilder extends YupBuilder {
  // ... custom overrides etc
}

const builder = new MyYupBuilder(schema, config);
const { yupSchema } = builder;
// ...
```

### 14.4. <a name='Errormessages'></a>Error messages

You can pass an `errMessages` object in the optional `config` object argument with key mappings for your custom validation error messages.

```js
const config = {
  errMessages: {
    apple: {
      required: "Bad apple",
      typeError: "Doest not look like apple to me",
    },
  },
};
```

You can alternatively specify an `errMessage` entry on any of your schema entries:

```js
"properties": {
    "apple": {
        "type": "string",
        "required": true,
        "errMessage": "Bad apple"
    },
    "orange": {
        "type": "string",
        "required": true,
        "errMessage": "Bad orange"
    }
},
```

For fine-tuned error messages specify an `errMessages` map object entry on any of your schema entries:

```js
"properties": {
    "apple": {
        "type": "string",
        "required": true,
        "min": 5,
        "errMessages": {
          "required": "Bad apple",
          "min": "Apple name too short"
        }
    },
    // ...
}
```

You can set the specific keys to be used for error handling via `errMessageKey` and `errMessagesMapKey` on the config object

```js
const config = {
  errMessagesMapKey: 'errMessageMap`
}
```

Then use this custom key in your JSON

```js
    "apple": {
        "type": "string",
        "required": true,
        "min": 5,
        "errMessageMap": {
          "required": "Bad apple",
          "min": "Apple name too short"
        }
    },
```

### 14.5. <a name='Customerrorfunctions'></a>Custom error functions

You can also add custom error functions at a granular level with access to `constraints`, `key` , `keyPath`, `title`, `description`, `parentNode` and `typeHandler`

````js
  const message2 = {
    title: "users",
    type: "object",
    required: ["amazon"],
    properties: {
      amazon: { type: "string", pattern: /(foo|bar)/, title: "amazonas" },
    },
  };
  const config = {
    errMessages: {
      amazon: {
        pattern: (constraints, { title, parentNode  }) =>
          `Pattern must be ${constraints.pattern} for ${title} of ${parentNode.title}`,
      },
    },
  };
  try {
    const yupSchema = buildYup(message2, config);
    valid = yupSchema.validateSync({
      amazon: "dfds",
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe("Pattern must be /(foo|bar)/ for amazonas");
});

### 19.5. <a name='Errormessagehandling'></a>Error message handling

Internally the validator error messages are resolved via an instance of the `ErrorMessageHandler` calling the `validationErrorMessage` method.

```js
  notOneOf() {
    const {not, notOneOf} = this.value
    const $oneOf = notOneOf || (not && (not.enum || not.oneOf))
    $oneOf && this
      .base
      .notOneOf($oneOf, this.validationErrorMessage('notOneOf'))
    return this
  }
````

Error handling

```js
class ErrorMessageHandler {
  // ...
  validationErrorMessage(msgName) {
    const { constraints, description, title } = this;
    const errMsg = this.errMessageFor(msgName);
    return typeof errMsg === "function"
      ? errMsg(constraints, { description, title })
      : errMsg;
  }
}
```

Note that the error message function has `description` and `title` available.

#### 19.5.1. <a name='Useacustomerrormessagehandler'></a>Use a custom error message handler

For simple cases, you can use the `config` object to pass your own custom `validationErrorMessage` function. In the example below we expand the default function to use `value.errors` if present on the entry type value object (similar to `errMessage` above).

```js
const config = {
  validationErrorMessage: (msgName, typeHandler) => {
    const { constraints, description, title, value } = typeHandler;
    const customErrMsg = value.errors && value.errors[msgName];
    const errMsg = customErrMsg || this.errMessageFor(msgName);
    return typeof errMsg === "function"
      ? errMsg(constraints, { description, title })
      : errMsg;
  },
};
```

You can also subclass the existing `ErrorMessageHandler` as follows

```js
import { ErrorMessageHandler } from "schema-to-yup";

class MyErrorMessageHandler extends ErrorMessageHandler {
  // ...
}

const createErrorMessageHandler = (typeHandler, config = {}) => {
  return new MyErrorMessageHandler(typeHandler, config);
};
```

You could f.ex override `errMessageFor` as follows, using the `type`

```js
  errMessageFor(name) {
    return this.propertyErrMessageFor(name) || this.genericErrMessageFor(name)
  }

  propertyErrMessageFor(name) {
    const { errMessages, key } = this;
    const errMsg = errMessages[key];
    if (!errMsg) return
    return errMsg[name]
  }

  genericErrMessageFor(name) {
    const { errMessages, type } = this;
    const genricErrMsgMap = errMessages['_generic_'];
    const fullName = `${type}.${name}`
    return genricErrMsgMap[fullName] || genricErrMsgMap[name];
  }
```

Then pass in your factory function in `config` as follows.

```js
const config = {
  createErrorMessageHandler,
};
```

You can pass the `errMessages` as follows. Note that you can define error messages specific to a property such as `emailAdr.format` and generic messages prefixed with `$` such as `$email` and `$required`.
Note: This convention might well change in future releases.

```js
let config = {
  errMessages: {
    emailAdr: {
      // note: would also work with email as the key
      format: "emailAdr must be a valid email",
    },
    // generic fallback message for any email format validation and required fields
    // note: if not present uses yup default validation message
    $email: "Email format incorrect",
    $required: "Required field",
  },
};
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
  "maximum",
];

export const defaults = {
  errMessages: (keys = errValKeys) =>
    keys.reduce((acc, key) => {
      const fn = ({ key, value }) =>
        `${key}: invalid for ${value.name || value.title}`;
      acc[key] = fn;
      return acc;
    }, {}),
};
```

### 19.6. <a name='Customvalidationmessagesusingselectdefaults'></a>Custom validation messages using select defaults

```js
const { buildYup, types } = require("schema-to-yup");
const { defaults } = types;

const myErrMessages = require("./err-messages");
const valKeys = ["lowercase", "integer"];

// by default Yup built-in validation error messages will be used if not overridden here
const errMessages = {
  ...defaults.errMessages(valKeys),
  myErrMessages,
};

const yupSchema = buildYup(json, {
  errMessages,
});
```

## 20. <a name='Addingcustomconstraints'></a>Adding custom constraints

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
    return this.addTrueValueConstraint("strict");
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
      const fnName = key === 'value' ? 'addTrueValueConstraint' : 'addConstraint'
      list.map(this.[fnName]);
    });
  }

  get constraintsMap() {
    return {
      simple: ["default", "required", "notRequired", "nullable"],
      trueValue: ["strict"]
    };
  }
```

For more complex contraints that:

- have multiple valid constraint names
- require validation
- optional transformation

You can create a separate `Constraint` subclass, to offload and handle it all separately. Here is a sample `RangeConstraint` used by number.

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
      min: ["minimum", "min"],
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

## Typings

Typings are available in the `types` folder

Generate typings

```bash
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## Development

### Build and Sample run

`$ yarn run build`

Sample runs (uses built file in `dist`)

`node sample-runs/person-schema.mjs`

This sample run is configured with detailed logging in the `config` object:

```js
{
  logging: true,
  logDetailed: [{
    propName: 'exclusiveMinimum',
    key: 'age'
  }]
}
```
