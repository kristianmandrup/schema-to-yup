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
    const enable = config.enable || {};
    this.enable = enable;
    // what type of logger to use
    this.log = typeof log === "function" ? log : console.log;
    this.err = typeof error === "function" ? error : console.error;
  }

  error(errMsg) {
    // only disable if directly disabled
    if (this.enable.error === false) return;
    this.err && this.err(errMsg);
    throw errMsg;
  }

  warn(warnMsg) {
    if (!this.enable.warn) return;
    this.logInfo("WARNING: " + warnMsg);
  }

  logInfo(name, value) {
    if (!this.enable.log) return;
    this.log && this.log(name, value);
  }
}

module.exports = {
  Base
};
