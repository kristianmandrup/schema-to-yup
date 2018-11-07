class Base {
  constructor(config = {}) {
    const { log, error } = config;
    this.log = typeof log === "boolean" ? console.log : log;
    this.err = typeof error === "boolean" ? console.error : error;
  }

  error(errMsg) {
    this.err && this.err(errMsg);
    throw new Error(errMsg);
  }

  logInfo(name, value) {
    this.log && this.log(name, value);
  }
}

module.exports = {
  Base
};
