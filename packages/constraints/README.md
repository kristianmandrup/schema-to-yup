# `@schema-validator/constraints`

Classes to extract constraints from JSON schema

## Usage

```ts
import * as constraints from "@schema-validator/constraints";

// TODO
```

## Design

- `string` constraint
- `number` constraint
- `date` constraint
- `RegExp` constraint
- `conditional`
  - `when` constraint

### String

- `transform(value)` transforms value to a valid string
- `isValidConstraintValue(value)` check if value is a valid string

### Numeric

- `transform(value)` transforms value to a valid number
- `isValidConstraintValue(value)` check if value is a valid number

### Date

TODO: Too much indirection!

- `transform(date)` transforms value to a valid Date
- `isValidConstraintValue(date)` check if value is a valid Date

### RegExp

- `transform(value)` transforms value to a valid RegExp
- `isValidConstraintValue(value)` check if value is a valid RegExp

## Tests

Running all tests

`$ npx jest` or `$ npm test`

### Running matching tests

`$ npx jest -t 'child-entry'`
