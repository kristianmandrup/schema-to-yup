function createYupSchemaEntry({ name, key, value, config }) {
  const { YupSchemaEntry } = config || {};
  if (!YupSchemaEntry) {
    throw "missing YupSchemaEntry class in config";
  }
  return new YupSchemaEntry({
    name,
    key,
    value,
    config
  }).toEntry();
}

export {
  createYupSchemaEntry
};
