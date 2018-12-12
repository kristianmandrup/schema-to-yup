const { Constraint } = require("../_constraint");

function createRange(typer) {
  return new Range(typer);
}

class Range extends Constraint {
  constructor(typer) {
    super(typer);
  }

  add() {
    const $map = this.map;
    Object.keys($map).map(yupMethod => {
      const names = $map[yupMethod];
      this.addConstraints(yupMethod, names);
    });
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
    return this.toNumber(value);
  }

  isValidConstraint(value) {
    return this.isNumberLike(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a number or convertible to a number`;
  }
}
