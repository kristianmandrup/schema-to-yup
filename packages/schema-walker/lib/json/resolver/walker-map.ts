import {
  ObjectSchemaEntryWalker,
  ArraySchemaEntryWalker,
  PrimitiveSchemaEntryWalker
} from "../walker";

export const schemaTypeWalkerMap = {
  object: opts => new ObjectSchemaEntryWalker(opts),
  array: opts => new ArraySchemaEntryWalker(opts),
  primitive: opts => new PrimitiveSchemaEntryWalker(opts)
};
