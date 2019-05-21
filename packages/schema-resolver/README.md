# `@schema-validator/schema-resolver`

Resolve/normalize schema entries such as:

- `$ref` ie. references
- `required`

Currently also contains a schema validator (perhaps move validator to `core`?)

## Usage

```ts
import { createSchemaResolver } from "@schema-validator/schema-resolver";

const config = {
  // TODO
};
const schemaResolver = createSchemaResolver(config);
```

## Tests

Running all tests

`$ npx jest` or `$ npm test`

### Running matching tests

`$ npx jest -t 'child-entry'`
