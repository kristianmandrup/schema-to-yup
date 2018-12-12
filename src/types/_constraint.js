class Constraint {
  constructor(typer) {
    this.typer = typer;
    this.delegates.map(name => {
      this[name] = typer[name];
    });
  }

  get delegates() {
    return [
      "constraints",
      "addConstraint",
      "warm",
      "error",
      "config",
      "isNothing"
    ];
  }

  addConstraints(method, names = []) {
    names.map(name => {
      const value = this.validateAndTransform(name);
      this.addConstraint(name, { method, value });
    });
    return this;
  }

  validateAndTransform(name) {
    const cv = this.constraints[name];
    this.validate(cv);
    return this.transform(cv);
  }

  invalidMsg(name, value) {
    return `invalid constraint for ${name}, was ${value}.`;
  }

  get explainConstraintValidMsg() {
    return "";
  }

  invalidConstraintMsg(name, value) {
    return [this.invalidMsg(name, value), this.explainConstraintValidMsg].join(
      "\n"
    );
  }

  validate(cv) {
    if (this.isNothing(cv)) {
      return this;
    }
    if (!this.isValidConstraint(cv)) {
      return this.handleInvalidConstraint(name, cv);
    }
  }

  // override
  isValidConstraint(value) {
    return true;
  }

  handleInvalidConstraint(name, value) {
    const msg = this.invalidConstraintMsg(name, value);
    if (this.config.warnOnInvalid) {
      this.warn(msg);
      return this;
    }
    this.error(msg, value);
    return this;
  }
}

module.exports = {
  Constraint
};
