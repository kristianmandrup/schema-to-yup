class Loggable {
  constructor(config = {}) {
    this.config = config;
    const { log, error } = config;
    const enable = config.enable || {};
    if (config.logging === true) {
      enable.log = true;
    }
    if (config.logging === false) {
      enable.log = false;
    }
    this.enable = enable;
    // what type of logger to use
    this.log = typeof log === "function" ? log : console.log;
    this.err = typeof error === "function" ? error : console.error;
  }

  error(errMsg, ...values) {
    // only disable if directly disabled
    if (this.enable.error === false) return;
    if (!this.err) return;
    values && values.length ? this.err(errMsg, ...values) : this.err(errMsg);
    throw errMsg;
  }

  warn(warnMsg, ...values) {
    if (!this.enable.warn) return;
    this.logInfo("WARNING: " + warnMsg, ...values);
  }

  logTypeInfo(name, ...values) {
    if (!this.enable.log) return;
    if (!this.log) return;
    const matchTypeList = this.config.logTypes || [];
    if (!matchTypeList.length) return;
    const found = matchTypeList.find((matchType) => this.type === matchType);
    if (!found) return;
    logInfo(name, ...values);
  }

  logDetails(label, idObj, ...values) {
    const matchIdList = this.config.logDetailed || [];
    if (!matchIdList.length) return;
    const found = matchIdList.find((matchIds) => {
      if (matchIds.key && idObj.key !== matchIds.key) return false;
      if (
        matchIds.constraintName &&
        idObj.constraintName !== matchIds.constraintName
      )
        return false;
      if (matchIds.propName && idObj.propName !== matchIds.propName)
        return false;
      if (matchIds.method && idObj.method !== matchIds.method) return false;
      return true;
    });
    found && this.logInfo(label, idObj, ...values);
  }

  logInfo(name, ...values) {
    if (!this.enable.log) return;
    if (!this.log) return;
    values && values.length ? this.log(name, ...values) : this.log(name);
  }
}

export { Loggable };
