import { Constraint } from "./constraint";

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
    return this.isStringType(value) || this.isNumberType(value);
  }

  isNumberType(num) {
    return !isNaN(num);
  }

  isStringType(val) {
    return typeof val === "string";
  }
}
