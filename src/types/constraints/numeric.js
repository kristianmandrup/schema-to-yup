const { Constraint } = require("../constraints/base");

function createNumericConstraint(typer, opts) {
  return new NumericConstraint(typer, opts);
}

class NumericConstraint extends Constraint {
  constructor(typer, opts = {}) {
    super(typer, opts);
  }

  transform(value) {
    return this.typer.toNumber(value);
  }

  isValidConstraintValue(value) {
    return this.typer.isNumberLike(value) && this.checkValue(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a number or convertible to a number.`;
  }
}

module.exports = {
  createNumericConstraint,
  NumericConstraint
};
