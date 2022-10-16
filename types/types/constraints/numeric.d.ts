export function createNumericConstraint(typer: any): NumericConstraint;
export class NumericConstraint extends Constraint {
    constructor(typeHandler: any);
    transform(value: any): any;
    isValidConstraint(value: any): any;
}
import { Constraint } from "../constraints/base";
