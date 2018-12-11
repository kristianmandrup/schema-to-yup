const defaults = require("./defaults");
const { createYupSchemaEntry } = require("../create-entry");

class Base {
  constructor(config = {}) {
    config = {
      createYupSchemaEntry,
      ...config
    };
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
    const { log, error } = config;
    this.log = typeof log === "boolean" ? console.log : log;
    this.err = typeof error === "boolean" ? console.error : error;
  }

  error(errMsg) {
    this.err && this.err(errMsg);
    throw new Error(errMsg);
  }

  warn(warnMsg) {
    this.logInfo && this.logInfo("WARNING: " + warnMsg);
  }

  logInfo(name, value) {
    this.log && this.log(name, value);
  }
}

module.exports = {
  Base
};
