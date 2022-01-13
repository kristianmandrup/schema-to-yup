import { Constraint } from './base';

function createStringConstraint(typer, map) {
  return new StringConstraint(typer, map);
}

class StringConstraint extends Constraint {
  constructor(typeHandler, map = {}) {
    super(typeHandler, map);
  }

  isValidConstraint(value) {
    return this.typeHandler.isStringType(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a String`;
  }
}

export {
  createStringConstraint,
  StringConstraint
};
