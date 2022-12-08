<!-- vscode-markdown-toc -->

- 1. [Schemas](#Schemas)
  - 1.1. [JSON schema](#JSONschema)
  - 1.2. [GraphQL schema](#GraphQLschema)
  - 1.3. [Avro schema](#Avroschema)
  - 1.4. [Custom/Alternative schemas](#CustomAlternativeschemas)
- 2. [Custom/Alternative validators](#CustomAlternativevalidators)
- 3. [Customization hooks](#Customizationhooks)
- 4. [Typescript and Typings](#TypescriptandTypings)
- 5. [Build and Sample run](#BuildandSamplerun)
- 6. [Quick start](#Quickstart)
  - 6.1. [Refs](#Refs)
  - 6.2. [Mode](#Mode)
  - 6.3. [Shape](#Shape)
- 7. [Types](#Types)
  - 7.1. [Mixed (any type)](#Mixedanytype)
  - 7.2. [Reference constraints](#Referenceconstraints)
  - 7.3. [Array](#Array)
  - 7.4. [Boolean](#Boolean)
  - 7.5. [Date](#Date)
  - 7.6. [Number](#Number)
  - 7.7. [Object](#Object)
  - 7.8. [String](#String)
- 8. [Similar projects](#Similarprojects)
- 9. [Advanced config](#Advancedconfig)
- 10. [Testing](#Testing)
- 11. [Development](#Development)
- 12. [Ideas and suggestions](#Ideasandsuggestions)
- 13. [Author](#Author)
- 14. [License](#License)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc --># Schema to Yup schema

Build a Yup schema from a JSON Schema, GraphQL schema (type definition) or any other similar type/class and field/properties model or schema :)

## 1. <a name='Schemas'></a>Schemas

- JSON
- GraphQL
- Avro
- Custom

### 1.1. <a name='JSONschema'></a>JSON schema

- [AJV: JSON Schema keywords](https://ajv.js.org/keywords.html)
- [Learn JsonSchema](https://cswr.github.io/JsonSchema/)

The builder currently supports the most commonly used [JSON Schema layout](https://json-schema.org/)

### 1.2. <a name='GraphQLschema'></a>GraphQL schema

GraphQL type definition exports using [graphSchemaToJson](https://github.com/kristianmandrup/graphSchemaToJson) (see [GraphQL schema](#graphql-schema)).

### 1.3. <a name='Avroschema'></a>Avro schema

Recently basic [Avro](https://avro.apache.org/docs/current/spec.html) schema support has been added as well.

### 1.4. <a name='CustomAlternativeschemas'></a>Custom/Alternative schemas

You can easily add support for your own custom schema formats.

We also supports some extra convenience schema properties that make it more "smooth" to define validation requirements declaratively (see below).

According to the JSON schema specs, you are free to add extra metadata to the field schema definitions beyond those supported "natively".

## 2. <a name='CustomAlternativevalidators'></a>Custom/Alternative validators

You can supply your own pre-configured global Yup instance to be used as a base.

You can also use the building blocks of this library to support alternative validators other than Yup.

See [Supporting alternative validators](#supporting-alternative-validators)

## 3. <a name='Customizationhooks'></a>Customization hooks

This library is built to be easy to customize or extend to suit individual developer needs.
|Use any of the following customization hooks to add custom features, circumvent missing functionality or bugs or extend any way you see fit. You can even use these hooks to support a different validator library, leveraging the generic schema validator builder infrastructure.

- [Custom builder](#custom-builder)
- [Custom builder functions](#custom-builder-functions)
- [entry builders](#custom-entry-builders)
- [type handlers](#custom-type-handlers)
- [constraint handler functions](#custom-constraint-handler-functions)
- [constraint builder](#custom-constraint-builder)

## 4. <a name='TypescriptandTypings'></a>Typescript and Typings

Typings are available in the `types` folder

Generate typings

```bash
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

You can use the `YupBuilderConfig` and `TypeHandlerConfig` type interfaces to facilitate building up the `config` object to pass to the `YupBuilder`.

## 5. <a name='BuildandSamplerun'></a>Build and Sample run

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

## 6. <a name='Quickstart'></a>Quick start

Install

`npm install schema-to-yup -S` or `yarn add schema-to-yup`

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
      type: "string",
    },
    email: {
      type: "string",
      format: "email",
    },
    foobar: {
      type: "string",
      matches: "(foo|bar)",
    },
    age: {
      description: "Age of person",
      type: "number",
      exclusiveMinimum: 0,
      required: true,
    },
    characterType: {
      enum: ["good", "bad"],
      enum_titles: ["Good", "Bad"],
      type: "string",
      title: "Type of people",
      propertyOrder: 3,
    },
  },
  required: ["name", "email"],
};

const config = {
  // for error messages...
  errMessages: {
    age: {
      required: "A person must have an age",
    },
    email: {
      required: "You must enter an email address",
      format: "Not a valid email address",
    },
  },
};

const { buildYup } = require("schema-to-yup");
const yupSchema = buildYup(schema, config);
// console.dir(schema)
const valid = await yupSchema.isValid({
  name: "jimmy",
  age: 24,
});

console.log({
  valid,
});
// => {valid: true}
```

This would generate the following Yup validation schema:

```js
const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required().positive(),
});
```

Note the `"required": true` for the `age` property (not natively supported by JSON schema).

### 6.1. <a name='Refs'></a>Refs

Please note that this library does not currently resolve `$ref` (JSON Pointers) out of the box. You can use another library for that.

You could f.ex use [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser) to preprocess your schema. Also see:

- [schema-deref](https://www.npmjs.com/package/schema-deref)
- [jsonref](https://www.npmjs.com/package/jsonref)

### 6.2. <a name='Mode'></a>Mode

By default, any property will be explicitly `notRequired` unless set to be required, either via `required: true` in the property constraint object or via the `required` list of properties of the `object` schema definition (of the property).

You can override the `notRequired` behavior by setting it on the new `mode` object of the configuration which can be used to control and fine-tune runtime behaviour.

```js
const jsonSchema = {
  title: "users",
  type: "object",
  properties: {
    username: { type: "string" },
  },
};
```

```js
const yupSchema = buildYup(jsonSchema, {
  mode: {
    notRequired: true, // default setting
  },
});

// will be valid since username is not required by default
const valid = yupSchema.validateSync({
  foo: "dfds",
});
```

```js
const yupSchema = buildYup(jsonSchema, {
  mode: {
    notRequired: true, // default setting
  },
});
// will be invalid since username is required by default when notRequired mode is disabled
const valid = yupSchema.validateSync({
  foo: "dfds",
});
```

The new run time mode settings are demonstrated under `sample-runs/mode`

No validation error (prop not required unless explicitly specified):

`$ npx babel-node sample-runs/modes/not-required-on.js`

Validation error if not valid type:

`$ npx babel-node sample-runs/modes/not-required-on.js`

### 6.3. <a name='Shape'></a>Shape

You can access the internal Yup shape, via `shapeConfig` on the yup schema returned by the `buildYup` schema builder function. Alternatively simply call `propsToShape()` on the yup builder.

This allows you to easily mix and match to suit more advanced requirements.

```js
const { buildYup } = require("json-schema-to-yup");
const { shapeConfig } = buildYup(json, config);
// alternatively
// const shape = buildYup(json, config).propsToShape()
const schema = yup.object().shape({
  ...shapeConfig,
  ...customShapeConfig,
});
```

## 7. <a name='Types'></a>Types

Currently the following schema types are supported:

- `array`
- `boolean`
- `date`
- `number`
- `object`
- `string`

### 7.1. <a name='Mixedanytype'></a>Mixed (any type)

- `strict`
- `default`
- `nullable`
- `const`
- `required`
- `notRequired`
- `oneOf` (`enum`, `anyOf`)
- `notOneOf`
- `refValue` for confirm password scenario
- `when`
- `isType`
- `nullable` (`isNullable`)

### 7.2. <a name='Referenceconstraints'></a>Reference constraints

Reference constraints within the schema can be defined as follows:

```js
schema = {
  required: ["startDate", "endDate"],
  type: "object",
  properties: {
    startDate: {
      type: "number",
    },
    endDate: {
      type: "number",
      min: "startDate",
    },
  },
};
```

Internally this will be resolved using `Yup.ref` as documented [here in the Yup readme](https://github.com/jquense/yup#refpath-string-options--contextprefix-string--ref).

`ref` allows you to reference the value of a sibling (or sibling descendant) field to validate the current field.

`Yup.ref` is supported in the Yup docs for the following:

- string: [.length](https://github.com/jquense/yup#stringlengthlimit-number--ref-message-string--function-schema), [.min](https://github.com/jquense/yup#stringminlimit-number--ref-message-string--function-schema), [.max](https://github.com/jquense/yup#stringmaxlimit-number--ref-message-string--function-schema)
- number: [.min](https://github.com/jquense/yup#numberminlimit-number--ref-message-string--function-schema), [.max](https://github.com/jquense/yup#numbermaxlimit-number--ref-message-string--function-schema), [.lessThan](https://github.com/jquense/yup#numberlessthanmax-number--ref-message-string--function-schema), [.moreThan](https://github.com/jquense/yup#numbermorethanmin-number--ref-message-string--function-schema)
- date: [.min](https://github.com/jquense/yup#dateminlimit-date--string--ref-message-string--function-schema), [.max](https://github.com/jquense/yup#datemaxlimit-date--string--ref-message-string--function-schema)
- array: [.length](https://github.com/jquense/yup#arraylengthlength-number--ref-message-string--function-this), [.min](https://github.com/jquense/yup#arrayminlimit-number--ref-message-string--function-this), [.max](https://github.com/jquense/yup#arraymaxlimit-number--ref-message-string--function-this)

### 7.3. <a name='Array'></a>Array

- `ensure`
- `compact`
- `items` (`of`)
- `maxItems` (`max`)
- `minItems` (`min`)
- `itemsOf` (`of`)

### 7.4. <a name='Boolean'></a>Boolean

No keys

### 7.5. <a name='Date'></a>Date

- `maxDate` (`max`)
- `minDate` (`min`)

### 7.6. <a name='Number'></a>Number

- `integer`
- `moreThan` (`exclusiveMinimum`)
- `lessThan` (`exclusiveMaximum`)
- `positive`
- `negative`
- `min` (`minimum`)
- `max` (`maximum`)
- `truncate`
- `round`

### 7.7. <a name='Object'></a>Object

- `camelCase`
- `constantCase`
- `noUnknown` (`propertyNames`)

### 7.8. <a name='String'></a>String

- `minLength` (`min`)
- `maxLength` (`max`)
- `pattern` (`matches` or `regex`)
- `email` (`format: 'email'`)
- `url` (`format: 'url'`)
- `lowercase`
- `uppercase`
- `trim`

For pattern (RegExp) you can additionally provide a flags property, such as `flags: 'i'`. This will be converted to a `RegExp` using `new RegExp(pattern, flags)`

For the `pattern` constraint you can also pass in `excludeEmptyString` to exclude empty string from being evaluated as a pattern constraints.

## 8. <a name='Similarprojects'></a>Similar projects

- [JSON schema to Elastic Search mapping](https://github.com/kristianmandrup/json-schema-to-es-mapping)
- [JSON Schema to GraphQL types with decorators/directives](https://github.com/kristianmandrup/json-schema-to-graphql-types-decorated)
- [JSON Schema to Mongoose schema](https://github.com/kristianmandrup/convert-json-schema-to-mongoose)
- [JSON Schema to MobX State Tree types](https://github.com/ralusek/jsonschema-to-mobx-state-tree)
- [Convert JSON schema to mongoose 5 schema](https://github.com/kristianmandrup/convert-json-schema-to-mongoose)

The library [JSON Schema model builder](https://github.com/kristianmandrup/json-schema-model-builder#readme) is a powerful toolset to build a framework to create any kind of output model from a JSON schema.

If you enjoy this declarative/generator approach, try it out!

## 9. <a name='Advancedconfig'></a>Advanced config

See [Advanced config](./Advanced.md)

## 10. <a name='Testing'></a>Testing

Uses [jest](jestjs.io/) for unit testing.

- Have unit tests that cover most of the constraints supported.
- Could use some refactoring using the latest infrastructure (see `NumericConstraint`)
- Please help add more test coverage and help refactor to make this lib even more awesome :)

## 11. <a name='Development'></a>Development

A new version is under development at [schema-to-yup-mono](https://github.com/kristianmandrup/schema-to-yup-mono) which is this code ported to a lerna monorepo with a cleaner, mode modular structyure. More work needs to be done in terms of TDD and unit testing. Ideally this repo should be ported to [Nx](https://nx.dev/)

## 12. <a name='Ideasandsuggestions'></a>Ideas and suggestions

Please feel free to come with ideas and suggestions on how to further improve this library.

## 13. <a name='Author'></a>Author

2018 Kristian Mandrup (CTO@Tecla5)

## 14. <a name='License'></a>License

MIT
