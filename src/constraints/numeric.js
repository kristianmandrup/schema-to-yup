import { Constraint } from "../constraints/base";

export function createNumericConstraint(typer) {
  return new NumericConstraint(typer);
}

export class NumericConstraint extends Constraint {
  constructor(typer) {
    super(typer);
  }

  transform(value) {
    return this.typer.toNumber(value);
  }

  isValidConstraint(value) {
    return this.typer.isNumberLike(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a number or convertible to a number`;
  }
}
