export function createSchemaEntry(opts: any = {}) {
  const config = opts.config || {};
  const { SchemaEntry, buildSchemaEntry } = config;
  if (buildSchemaEntry) {
    return buildSchemaEntry(opts);
  }
  if (!SchemaEntry) {
    throw "missing buildSchemaEntry or SchemaEntry class in config to create entries";
  }
  return new SchemaEntry(opts).toEntry();
}
