export function createSchemaEntry(opts: any = {}) {
  const { name, key, value, config } = opts;
  const { SchemaEntry = null } = config || {};
  if (!SchemaEntry) {
    throw "missing SchemaEntry class in config";
  }
  return new SchemaEntry({
    name,
    key,
    value,
    config
  }).toEntry();
}
