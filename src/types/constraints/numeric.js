import { Constraint } from '../constraints/base';

function createNumericConstraint(typer) {
  return new NumericConstraint(typer);
}

class NumericConstraint extends Constraint {
  constructor(typeHandler) {
    super(typeHandler);
  }

  transform(value) {
    return this.typeHandler.toNumber(value);
  }

  isValidConstraint(value) {
    return this.typeHandler.isNumberLike(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a number or convertible to a number`;
  }
}

export {
  createNumericConstraint,
  NumericConstraint
};
