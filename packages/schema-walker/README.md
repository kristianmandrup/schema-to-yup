# `@schema-validator/schema-walker`

General purpose JSON schema walker

## Usage

```
const schemaWalker = require('@schema-validator/schema-walker');

// TODO: DEMONSTRATE API
```

## Design

Each schema entry walker class must implement `ISchemaEntryWalker`

```ts
export interface ISchemaEntryWalker {
  walk: VoidEntryFn
  onEnterEntry: VoidEntryFn
  onExitEntry: VoidEntryFn
}
```

### SchemaEntryWalker

`SchemaEntryWalker` is the base class for any class used to walk the schema entries.

### RootObjectSchemaEntryWalker

`RootObjectSchemaEntryWalker` is used to walk the root schema object.

### ObjectSchemaEntryWalker

`ObjectSchemaEntryWalker` is used to walk an object entry with sub entries as properties.

### ArraySchemaEntryWalker

`ArraySchemaEntryWalker` is used to walk an array entries
