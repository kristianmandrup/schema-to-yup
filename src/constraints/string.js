import { Constraint } from "./base";

export function createStringConstraint(typer, map) {
  return new StringConstraint(typer, map);
}

export class StringConstraint extends Constraint {
  constructor(typer, map = {}) {
    super(typer, map);
  }

  isValidConstraint(value) {
    return this.typer.isStringType(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a String`;
  }
}
