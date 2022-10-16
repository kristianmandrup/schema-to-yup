export class YupSchemaEntryError extends Error {
}
export class YupSchemaEntry extends Base {
    constructor(opts: any);
    parentNode: any;
    builder: any;
    opts: any;
    schema: any;
    key: any;
    value: any;
    name: any;
    get calcType(): any;
    get calcKind(): "multi" | "single";
    createNew(opts: any): any;
    init(): void;
    type: any;
    kind: string;
    get validator(): any;
    setPropertyHandler(): void;
    propertyValueHandler: any;
    get propertyHandlerOpts(): {
        type: any;
        parentNode: any;
        kind: string;
        types: any;
        value: any;
        name: any;
        key: any;
        schema: any;
        entryHandler: YupSchemaEntry;
    };
    createPropertyValueHandler(opts: any, config: any): import("./property-value-resolver").PropertyValueResolver;
    get defaultTypeHandlerMap(): {
        string: typeof toYupString;
        number: typeof toYupNumberSchemaEntry;
        boolean: typeof toYupBoolean;
        array: typeof toYupArray;
        object: typeof toYupObject;
        date: typeof toYupDate;
    };
    setTypeHandlers(): void;
    types: any;
    get typeHandlers(): any;
    isValidSchema(): boolean;
    error(msg: any, data: any): void;
    toEntry(): any;
}
import { Base } from "./types";
import { toYupString } from "./types";
import { toYupNumberSchemaEntry } from "./types";
import { toYupBoolean } from "./types";
import { toYupArray } from "./types";
import { toYupObject } from "./types";
import { toYupDate } from "./types";
export { Base };
