export class ConvertMappingSchemaError extends Error {}

export class InfoHandler {
  config: any;
  logging: boolean;
  log: Function;
  throws: boolean;

  constructor(config: any = {}) {
    this.config = config || this.config;
    this.logging = config.logging;
    this.log = config.log || console.log;
    this.throws =
      config.throws === true ||
      (config.throws === undefined && !config.onError);
  }

  captionedMsg(name: string, msg: string) {
    return `[${this.constructor.name}:${name}] ${msg}`;
  }

  info(name: string, msg: string, data?: any) {
    if (!this.logging) return;
    const infoMsg = this.captionedMsg(name, msg);
    const log = this.log;
    data ? log(infoMsg, data) : log(infoMsg);
  }

  error(name: string, msg: string, data?: any) {
    const errMsg = this.captionedMsg(name, msg);
    this.info(name, msg, data);
    if (this.throws) {
      this.throw(errMsg);
    }
    this.onError(errMsg, data);
  }

  throw(errMsg: string) {
    if (!this.throws) return;
    throw new ConvertMappingSchemaError(errMsg);
  }

  onError(errMsg: string, data?: any) {
    const onError = this.config.onError;
    if (typeof onError === "function") return;
    onError(errMsg, data);
  }
}
