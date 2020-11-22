import { Constraint } from '../constraints/base';
import { typeMatcher } from '../_type-matcher';

function createNumericConstraint(typer) {
  return new NumericConstraint(typer);
}

class NumericConstraint extends Constraint {
  constructor(typer) {
    super(typer);
  }

  transform(value) {
    return typeMatcher.toNumber(value);
  }

  isValidConstraint(value) {
    return typeMatcher.isNumberLike(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a number or convertible to a number`;
  }
}

export {
  createNumericConstraint,
  NumericConstraint
};
