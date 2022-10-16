export class WhenEntry {
    constructor(whenEntryObj: any, opts?: {});
    whenEntryObj: any;
    schema: any;
    when: any;
    properties: any;
    key: any;
    type: any;
    config: any;
    validateAndConfigure(whenEntryObj: any): boolean;
    createYupSchemaEntry(opts: any): any;
    createValue(entryObj: any, key: any): any;
    createEntryOpts(entryObj: any, whenKey: any): {
        schema: any;
        properties: any;
        key: any;
        type: any;
        value: any;
        config: any;
    };
    createEntry(entryObj: any, whenKey: any): any;
    hasKey(keys: any, findKey: any): any;
    hasAnyKey(keys: any, findKeys: any): any;
    whenEntryFor(whenObj: any, createEntryKey: any, whenKey: any): any;
    calcEntryObj(): any;
    get entryObj(): any;
    warn(msg: any, value: any): void;
    error(msg: any, value: any): void;
}
export function createWhenEntry(whenEntry: any, opts?: {}): WhenEntry;
