export function createRangeConstraint(typer: any): RangeConstraint;
export class RangeConstraint extends NumericConstraint {
    get $map(): {
        moreThan: string[];
        lessThan: string[];
        max: string[];
        min: string[];
    };
}
import { NumericConstraint } from "../constraints/numeric";
