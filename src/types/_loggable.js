class Loggable {
  constructor(config = {}) {
    const { log, error } = config;
    const enable = config.enable || {};
    this.enable = enable;
    // what type of logger to use
    this.log = typeof log === "function" ? log : console.log;
    this.err = typeof error === "function" ? error : console.error;
  }

  error(errMsg, value) {
    // only disable if directly disabled
    if (this.enable.error === false) return;
    this.err && (value ? this.err(errMsg, value) : this.err(errMsg));
    throw errMsg;
  }

  warn(warnMsg, value) {
    if (!this.enable.warn) return;
    this.logInfo("WARNING: " + warnMsg, value);
  }

  logInfo(name, value) {
    if (!this.enable.log) return;
    this.log && (value ? this.log(name, value) : this.log(name));
  }
}

export {
  Loggable
};
