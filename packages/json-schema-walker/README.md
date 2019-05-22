# `@schema-validator/json-schema-walker`

JSON Schema walker infrastructure

## Usage

```ts
const { createSchemaWalker } = require("@schema-validator/schema-walker");

const schemaWalker = createSchemaWalker(config);
schemaWalker.walk(schema);
```

The walker should walk the JSON schema by first traversing the main object with nested properties. Each of these top level properties can be either:

- Primitive type (`string`, `number`, ...)
- Array type (`array`)
- Nested object (`object`)

Note that any schema entry may have a `$ref` reference pointer which need to be resolved before it can be walked. References can be circular, so the reference resolver must maintain a list (cache) of visited refs in order to check and ensure against circular references (ie. use cached value if present).

The root schema walker can be passed custom walkers (or walker factories) for each of the main schema types: Primitive, Array and Object

Each of the main types have their own strategy for walking.

- Primitive (no children, no child walk)
- Array - walk items, resolve and walk each item
- Object - walk nested properties

## Design

Each schema entry walker class must implement `ISchemaEntryWalker`

```ts
export interface ISchemaEntryWalker {
  walk: VoidEntryFn;
  onEnterEntry: VoidEntryFn;
  onExitEntry: VoidEntryFn;
}
```

### SchemaEntryWalker

- `BaseSchemaEntryWalker` base class for walking the child entries
- `SchemaEntryWalker` class for walking schema entries
- `ChildSchemaEntryWalker` class for walking set of child entries

### RootObjectSchemaEntryWalker

- `RootObjectSchemaEntryWalker` is used to walk the root schema object

### ObjectSchemaEntryWalker

- `ObjectSchemaEntryWalker` is used to walk an object entry with sub entries as properties
- Uses `ChildSchemaEntryWalker` to walk property entries

### ArraySchemaEntryWalker

`ArraySchemaEntryWalker` is used to walk an array entries

## Tests

Running all tests

`$ npx jest` or `$ npm test`

### Running matching tests

`$ npx jest -t 'child-entry'`
