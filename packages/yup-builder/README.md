# `@schema-validator/yup-builder`

Yup validator builder. Builds the schema used to define a Yup validator.

## YupBuilder

Builds a Yup validator from validation constraints.

## Types

The `YupBuilder` takes a set of `types` that define how the schema for each supported validator schema type is built. This let's it customize how (or which) individual schema/validator types are supported and how they are built.

Primitives:

- `boolean`
- `string`
- `date`
- `number`

Array:

- `array`

Object (nested)

- `object`

### Array

`constraintsTypeMap`

- `rangeItems` numeric
- `maxItems` numeric
- `minItems` numeric

### Boolean

### Date

### Number

### Object

### String

`constraintsTypeMap`:

- `pattern` regexp
- `lengthRange` numeric
- `minLength` numeric
- `maxLength` numeric

`aliasMap`:

- `matches` `["pattern", "regexp"]`
- `maxLength` `["max"]`
- `minLength` `["min"]`

`constraintsMap`

- `on` `["trim", "cased", "email", "url"]`
- `value` `["matches", "lengthRange"]`

`grouped`

- `cased` `["lowercase", "uppercase"]`
- `lengthRange` `["minLength", "maxLength"]`

`enabled`:

- `lengthRange`
- `pattern`
- `cased`
- `email`
- `url`
- `genericFormat`
- `trim`

## Usage

```ts
const { createYupBuilder } = require("@schema-validator/yup-builder");

const onComplete = result => console.log("DONE", result);

const config = {
  onComplete
};

const builder = createYupBuilder(config);

// listen for builder onComplete
```

The builder should be listening to events carrying constraint information that trigger it to build an internal model. It should then receive an `onComplete` event (no more constraints to be found), which it can delegate to whoever is listening for the builder to finish. This is the async model.

Alternatively call the internal build methods directly with constraints (synchronous model).

## Tests

Running all tests

`$ npx jest` or `$ npm test`

### Running matching tests

`$ npx jest -t 'child-entry'`
