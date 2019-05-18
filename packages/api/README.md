# `@schema-validator/api`

API to create a validator from a schema

## TODO

Extract API from latest `schema-to-yup#master` and from `*-es-mapping` sister library. Ensure we have a `results` object available on `config` passed around and also an event/callback mechanism (such as `onComplete`, `onTypeEntry`, `onError` etc)

## Usage

```ts
import { buildValidator } from "@schema-validator/api";
import { builder as yupBuilder, types as yupTypes } from "@schema-validator/yup-builder";

const onComplete = (result ) => console.log('DONE', result)
const onError = (err) => console.error('ERROR', err)

const config = {
  validator: {
    name: "my-yup-validator",
    type: "yup"
  },
  schema: {
    type: "json"
  },
  builders: {
    yup: {
      builder: yupBuilder
      types: yupTypes
    }
  },
  // logging: true
  events: {
    onComplete,
    onError
  }
};

const schema = {
  // json schema
};

const obj = {
  name: "mike"
};

const validator = buildValidator({
  schema,
  config
});

const valid = validator.validateSync(obj);
```
