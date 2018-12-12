const defaults = require("./defaults");
const { createYupSchemaEntry } = require("../create-entry");
const { TypeMatcher } = require("./_type-matcher");

class Base extends TypeMatcher {
  constructor(config = {}) {
    super(config);
    config = {
      createYupSchemaEntry,
      ...config
    };
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }
}

module.exports = {
  Base
};
