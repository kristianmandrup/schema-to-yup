# Schema to Validator

Build a Validator from a schema such as a JSON schema or GraphQL schema (type definition)

## Install

- npm: `npm install schema-to-validator -S`
- yarn: `yarn add schema-to-validator`

## Quickstart

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

### Yup example

### JSON Schema

### GraphQL Schema

### Forg example

## Advanced

## Development

## Design

The packages should be designed to have little to no inter-dependencies. We strive for a loosely coupled, flexible design, using interfaces.

### Package structure

- `api` library surface API
- `constraints` type constraint classes (parse and resolve from schema)
- `core` core functionality such as Logger
- `schema-walker` general purpose walker architecture
- `validator-bridge` add extra validation methods to validator
- `forg-builder` build forg validator from constraints
- `yup-builder` build yup validator from constraints

[Setting up a monorepo with Lerna for a TypeScript project](https://blog.logrocket.com/setting-up-a-monorepo-with-lerna-for-a-typescript-project-b6a81fe8e4f8)

## Test

## License
