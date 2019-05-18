export type Enable = {
  log: boolean;
  error: boolean;
  warn: boolean;
};

export class Loggable {
  enable: Enable;
  log: Function;
  err: Function;
  warnOnInvalid: boolean;

  constructor(config: any = {}) {
    const { log, error, warn, warnOnInvalid } = config;
    const enable: Enable = config.enable || {};
    this.enable = enable;
    this.warnOnInvalid = warnOnInvalid;
    // what type of logger to use
    this.log = typeof log === "function" ? log : console.log;
    this.err = typeof error === "function" ? error : console.error;
  }

  error(errMsg: string, value?: any) {
    // only disable if directly disabled
    if (this.enable.error === false) return;
    this.err && (value ? this.err(errMsg, value) : this.err(errMsg));
    throw errMsg;
  }

  warn(warnMsg: string, value?: any) {
    if (!this.enable.warn) return;
    this.logInfo("WARNING: " + warnMsg, value);
  }

  logInfo(name: string, value?: any) {
    if (!this.enable.log) return;
    this.log && (value ? this.log(name, value) : this.log(name));
  }
}
