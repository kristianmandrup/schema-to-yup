import { Constraint, util } from "./constraint";
const { isStringType, isNumberType } = util;

export function createStringConstraint(typer, opts) {
  return new StringConstraint(typer, opts);
}

export class StringConstraint extends Constraint {
  constructor(typer, opts: any = {}) {
    super(typer, opts);
  }

  isValidConstraintValue(value) {
    return this.isStringConvertible(value);
  }

  transform(value) {
    return this.typer.toString(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a String or convertible to a string`;
  }

  isStringConvertible(value) {
    return isStringType(value) || isNumberType(value);
  }
}
