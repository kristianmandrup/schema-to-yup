const { Constraint } = require("./base");

function createRegExpConstraint(typer, opts) {
  return new RegExpConstraint(typer, opts);
}

class RegExpConstraint extends Constraint {
  constructor(typer, opts = {}) {
    super(typer, opts);
  }

  transform(value) {
    return this.toRegExp(value);
  }

  isValidConstraintValue(value) {
    return this.isRegExpLike(value);
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

module.exports = {
  createRegExpConstraint,
  RegExpConstraint
};
