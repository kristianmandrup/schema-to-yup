import { Constraint } from "./base";

export function createRegExpConstraint(typer, opts) {
  return new RegExpConstraint(typer, opts);
}

export class RegExpConstraint extends Constraint {
  constructor(typer, opts: any = {}) {
    super(typer, opts);
  }

  transform(value) {
    return this.toRegExp(value);
  }

  isValidConstraintValue(value) {
    return this.isRegExpLike(value);
  }

  toRegExp(value) {
    return new RegExp(value);
  }

  isRegExpLike(value) {
    return this.isRegExpConvertible(value);
  }

  isRegExpConvertible(value) {
    return (
      this.isRegExpType(value) ||
      this.isStringType(value) ||
      this.isNumberType(value)
    );
  }

  isRegExpType(value) {
    return value instanceof RegExp;
  }

  get explainConstraintValidMsg() {
    return `Must be either a RegExp or String`;
  }
}
