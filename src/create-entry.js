const { YupSchemaEntry } = require("./entry");

function createYupSchemaEntry({ name, key, value, config }) {
  return new YupSchemaEntry({
    name,
    key,
    value,
    config
  }).toEntry();
}
