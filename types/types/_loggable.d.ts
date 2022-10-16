export class Loggable {
    constructor(config?: {});
    config: {};
    enable: any;
    log: any;
    err: any;
    error(errMsg: any, ...values: any[]): void;
    warn(warnMsg: any, ...values: any[]): void;
    logTypeInfo(name: any, ...values: any[]): void;
    logDetails(label: any, idObj: any, ...values: any[]): void;
    logInfo(name: any, ...values: any[]): void;
}
