import { typeMatcher } from '../_type-matcher';
import { Constraint } from './base';

function createRegExpConstraint(typer, map) {
  return new RegExpConstraint(typer, map);
}

class RegExpConstraint extends Constraint {
  constructor(typer, map = {}) {
    super(typer, map);
  }

  transform(value) {
    return typeMatcher.toRegExp(value);
  }

  isValidConstraint(value) {
    return typeMatcher.isRegExpLike(value);
  }

  toRegExp(value) {
    return new RegExp(value);
  }

  isRegExpLike(value) {
    return value instanceof RegExp || this.isStringType(value);
  }

  get explainConstraintValidMsg() {
    return `Must be either a RegExp or String`;
  }
}

export {
  createRegExpConstraint,
  RegExpConstraint
};
