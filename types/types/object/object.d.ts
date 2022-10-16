export class YupObject extends YupMixed {
    static create(obj: any): YupObject;
    constructor(obj: any);
    get typeEnabled(): string[];
    convert(): YupObject;
    camelCase(): YupObject;
    constantCase(): YupObject;
    noUnknown(): YupObject;
}
import { YupMixed } from "../mixed";
