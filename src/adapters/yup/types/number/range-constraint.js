import { NumericConstraint } from "../constraints/numeric";

export function createRangeConstraint(typer) {
  return new RangeConstraint(typer);
}

export class RangeConstraint extends NumericConstraint {
  constructor(typer) {
    super(typer);
  }

  get $map() {
    return {
      moreThan: ["exclusiveMinimum", "moreThan"],
      lessThan: ["exclusiveMaximum", "lessThan"],
      max: ["maximum", "max"],
      min: ["minimum", "min"]
    };
  }
}
