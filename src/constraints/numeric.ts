import { Constraint } from "./base";

export function createNumericConstraint(typer, opts) {
  return new NumericConstraint(typer, opts);
}

const checkPositive = val => val >= 0;

export function createPositiveNumberConstraint(typer, opts) {
  return new NumericConstraint(typer, { ...opts, checkValue: checkPositive });
}

export class NumericConstraint extends Constraint {
  constructor(typer, opts = {}) {
    super(typer, opts);
  }

  transform(value) {
    return this.typer.toNumber(value);
  }

  isValidConstraintValue(value) {
    return this.typer.isNumberLike(value) && this.checkValue(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a number or convertible to a number.`;
  }
}
