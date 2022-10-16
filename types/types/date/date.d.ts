export class YupDate extends YupMixed {
    static create(obj: any): YupDate;
    constructor(obj: any);
    get typeEnabled(): string[];
    convert(): YupDate;
    toDate(date: any): Date | import("yup/lib/Reference").default<unknown>;
    isValidDateType(date: any): boolean;
    isValidDate(date: any): boolean;
    isValidDateFormat(date: any): boolean;
    transformToDate(date: any): any;
    minDate(): YupDate;
    maxDate(): YupDate;
    handleInvalidDate(name: any, value: any): YupDate;
}
import { YupMixed } from "../mixed";
