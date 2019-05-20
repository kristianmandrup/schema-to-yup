# `@schema-validator/core`

Core functionality

## common

### TypeMatcher

`TypeMatcher` is currently a base class that provides methods for testing javascript types. It should NOT/NEVER be used as a base class!!!

Use methods from `util` (from `core` module) directly instead!

### Loggable

`Loggable` is a base class that provides some useful logging methods:

- `error(methodName: string, errMsg: string, value?: any)`
- `warn(methodName: string, warnMsg: string, value?: any)`
- `logInfo(methodName: string, msg: string, value?: any)`

## inquiry

Inquiry methods are defined for each supported schema type:

- JSON Schema
- GraphQL type definition

The inquiry methods are:

- `getProps(obj)` get entry object properties
- `getType(obj)` get entry object type
- `getName` get entry object name
- `getConstraints(obj)` get constraints part of entry object

- `isString(obj)` test if entry object is a `string` constraint
- `isArray(obj)` test if entry object is an `array` constraint
- `isInteger(obj)` test if entry object is an `integer` number
- `isNumber(obj)` test if entry object is an `number` constraint
- `isBoolean(obj)` test if entry object is a `boolean` constraint
- `isObject(obj)` test if entry object is an `object` constraint
- `isDate(obj)` test if entry object is a `date` constraint
- `isRequired(obj)` test if entry object has a required constraint

- `hasDateFormat(obj) test if`format`of entry object is a`date`
- `hasFormat(obj, format) test if entry object`format` matches format tested for

## Usage

```ts
import { util, Loggable } from "@schema-validator/core";
const { isArray } = util;

export class Xyz extends Loggable {
  // ...
  constructor(opts, config) {
    super(config);
    // ...
  }
}
```
