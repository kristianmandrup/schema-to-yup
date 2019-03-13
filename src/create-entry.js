import { YupSchemaEntry } from "./entry";

function createYupSchemaEntry(opts = {}) {
  // const { schema, name, key, value, config } = opts;
  return new YupSchemaEntry(opts).toEntry();
}

export { createYupSchemaEntry };
