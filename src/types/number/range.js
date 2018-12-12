const { Constraint } = require("../_constraint");

function createRange(typer) {
  return new Range(typer);
}

class Range extends Constraint {
  constructor(typer) {
    super(typer);
  }

  get map() {
    return {
      moreThan: ["exclusiveMinimum", "moreThan"],
      lessThan: ["exclusiveMaximum", "lessThan"],
      max: ["maximum", "max"],
      min: ["minimum", "min"]
    };
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

module.exports = {
  createRange,
  Range
};
