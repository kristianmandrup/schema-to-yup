export class PropertyValueResolverError extends Error {
}
export class BasePropertyValueResolver extends Base {
    constructor(opts: any, config: any, entryHandler: any);
    entryHandler: any;
    parentNode: any;
    builder: any;
    opts: any;
    kind: any;
    value: any;
    schema: any;
    key: any;
    name: any;
    type: any;
    types: any;
    get validator(): any;
    error(msg: any, data: any): void;
    resolve(): void;
    get obj(): {
        schema: any;
        parentNode: any;
        key: any;
        value: any;
        type: any;
        kind: any;
        config: any;
        entryHandler: any;
    };
}
import { Base } from "./types";
