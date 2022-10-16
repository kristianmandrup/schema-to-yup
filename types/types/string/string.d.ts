export class YupString extends YupMixed {
    static create(obj: any): YupString;
    constructor(obj: any);
    convert(): YupString;
    get typeEnabled(): string[];
    trim(): YupString;
    lowercase(): YupString;
    uppercase(): YupString;
    genericFormat(): void;
    email(): YupString;
    constraintNameFor(...names: any[]): any;
    get isEmail(): any;
    url(): YupString;
    get isUrl(): any;
    minLength(): YupString;
    maxLength(): YupString;
    pattern(): YupString;
}
import { YupMixed } from "../mixed";
