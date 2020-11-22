import { typeMatcher } from '../_type-matcher';
import { Constraint } from './base';

function createStringConstraint(typer, map) {
  return new StringConstraint(typer, map);
}

class StringConstraint extends Constraint {
  constructor(typer, map = {}) {
    super(typer, map);
  }

  isValidConstraint(value) {
    return typeMatcher.isStringType(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a String`;
  }
}

export {
  createStringConstraint,
  StringConstraint
};
