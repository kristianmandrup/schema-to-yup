export class WhenCondition {
    constructor(opts?: {});
    opts: {};
    when: any;
    key: any;
    type: any;
    value: any;
    schema: any;
    properties: any;
    config: any;
    validate(): void;
    validateAndConfigure(when: any): boolean;
    whenKeys: string[];
    createWhenEntry(whenEntryObj: any, opts: any): import("./when-entry").WhenEntry;
    accumulate(acc: any, key: any): any;
    get constraintObj(): {};
    get keyVal(): string | string[];
    get constraintValue(): false | {}[];
    get constraint(): false | {}[];
    warn(msg: any, value: any): void;
    error(msg: any, value: any): void;
}
export function createWhenCondition(opts: any): WhenCondition;
