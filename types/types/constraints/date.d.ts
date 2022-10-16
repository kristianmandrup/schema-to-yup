export function createDateConstraint(typer: any, map: any): DateConstraint;
export class DateConstraint extends Constraint {
    constructor(typer: any, map?: {});
    transform(date: any): Date;
    isValidConstraint(date: any): any;
    isDateLike(date: any): boolean;
    toDate(date: any): Date;
    isValidDateType(date: any): boolean;
    isValidDate(date: any): any;
    isDateParseable(date: any): boolean;
    transformToDate(date: any): any;
}
import { Constraint } from "../constraints/base";
