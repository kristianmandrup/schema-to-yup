# `@schema-validator/yup-builder`

Yup validator builder. Builds the schema used to define a Yup validator.

## YupBuilder

## Types

The YupBuilder takes a set of `types` that define how the schema for each supported validator schema type is built. This makes it customize how (or which) individual schema/validator types are supported and how they are built.

- `boolean`
- `string`
- `date`
- `number`
- `array`
- `object`

Limitations/todo:

Currently `$ref` is not supported. Please extract functionality from our sister `*-es-mapping` library. Also ensures against circular refs

Also extract array resolution strategy from there.

## Usage

```
const yupBuilder = require('@schema-validator/yup-builder');

yupBuilder.build({
  // ...
})
```
