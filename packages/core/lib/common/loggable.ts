export type Enable = {
  log: boolean;
  error: boolean;
  warn: boolean;
};

export class Loggable {
  config: any;
  enable: Enable;
  log: Function;
  err: Function;
  warnOnInvalid: boolean;

  constructor(config: any = {}) {
    this.config = this.config || config;
    const { log, error, warn, warnOnInvalid } = config;
    const enable: Enable = config.enable || {};
    this.enable = enable;
    this.warnOnInvalid = warnOnInvalid;
    // what type of logger to use
    this.log = typeof log === "function" ? log : console.log;
    this.err = typeof error === "function" ? error : console.error;
  }

  error(methodName: string, errMsg: string, value?: any) {
    // only disable if directly disabled
    if (this.enable.error === false) return;
    this.err && (value ? this.err(errMsg, value) : this.err(errMsg));
    throw errMsg;
  }

  warn(methodName: string, warnMsg: string, value?: any) {
    if (!this.enable.warn) return;
    this.logInfo(methodName, "WARNING: " + warnMsg, value);
  }

  logInfo(methodName: string, msg: string, value?: any) {
    if (!this.enable.log) return;
    this.log &&
      (value ? this.log(methodName, msg, value) : this.log(methodName, msg));
  }
}
