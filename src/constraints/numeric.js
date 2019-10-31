import { Constraint } from '../constraints/base';

function createNumericConstraint(typer) {
  return new NumericConstraint(typer);
}

class NumericConstraint extends Constraint {
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

export {
  createNumericConstraint,
  NumericConstraint
};
