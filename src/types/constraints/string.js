const { Constraint } = require("./base");

function createStringConstraint(typer, opts) {
  return new StringConstraint(typer, opts);
}

class StringConstraint extends Constraint {
  constructor(typer, opts = {}) {
    super(typer, opts);
  }

  isValidConstraint(value) {
    return this.typer.isStringType(value);
  }

  get explainConstraintValidMsg() {
    return `Must be a String`;
  }
}

module.exports = {
  createStringConstraint,
  StringConstraint
};
