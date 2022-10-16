export class YupArray extends YupMixed {
    static create(obj: any): YupArray;
    constructor(obj: any);
    createYupSchemaEntry: any;
    convert(): YupArray;
    get typeEnabled(): string[];
    ensureItems(): YupArray;
    compact(): YupArray;
    itemsOf(): YupArray;
    maxItems(): YupArray;
    minItems(): YupArray;
    $items(): YupArray;
    $additionalItems(): YupArray;
    $uniqueItems(): YupArray;
    $contains(): YupArray;
    handleInvalidSize(name: any, value: any): YupArray;
    isValidSize(num: any): boolean;
}
import { YupMixed } from "../mixed";
