# `@schema-validator/api`

API to create a validator from a schema

## Design

See `build` function in `build.ts`. This should be the core entry point functionality (taken from `*-es-mapping` library).

```ts
export const build = (schema: any, config: any = {}) => {
  const { onComplete, onThrow } = config;
  try {
    config = buildConfig(config, schema);
    const properties = config.buildProperties(schema, config);
    const results = config.results;
    onComplete && onComplete(results);
    return {
      properties,
      results
    };
  } catch (err) {
    onThrow && onThrow(err);
    throw err;
  }
};
```

### build-config

The `build-config` is used to set all the core functions on the `config` object, to be used internally in the processing. This allows users to customize the processing as needed.

This also ensures against any circular dependencies for recursive calls, such as when resolving an `object` entry, which is resolved recursively like a schema :)

```ts
export const buildConfig = (config = {}, schema = {}) => {
  const builtConfig = {
    schema,
    resultObj: {},
    // validator configurations
    // walkers, // TODO
    // ...inquiry object?
    ...config // override with customizations
  };
  return builtConfig;
};
```

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

## Tests

Running all tests

`$ npx jest` or `$ npm test`

### Running matching tests

`$ npx jest -t 'child-entry'`

## TODO

Move `build-properties` to walker if use at all.
