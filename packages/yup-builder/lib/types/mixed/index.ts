import { MixedSchemaEntry } from "./mixed";
export { MixedSchemaEntry };

export function toSchemaEntry(obj, config = {}) {
  return obj && MixedSchemaEntry.create(obj).createSchemaEntry();
}
