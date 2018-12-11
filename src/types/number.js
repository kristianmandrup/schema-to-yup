const { YupMixed } = require("./mixed");

class NumberHandler {
  constructor(config) {
    this.config = config;
  }

  isNumber(obj) {
    return this.config.isNumber(obj);
  }

  handle(obj) {
    return this.isNumber(obj) && YupNumber.create(obj).yupped();
  }
}

function toYupNumber(obj, config = {}) {
  return obj && new NumberHandler(config).handle(obj);
}

class YupNumber extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.normalizeNumType(obj.type);
    this.base = this.yup.number();
  }

  normalizeNumType(type) {
    return type === "int" ? "integer" : type;
  }

  static create(obj) {
    return new YupNumber(obj);
  }

  convert() {
    this.inRange();
    this.positive()
      .negative()
      .integer();
    super.convert();
    return this;
  }

  truncate() {
    return this.addConstraint("truncate");
  }

  round() {
    const { round } = this.constraints;
    const $round = typeof round === "string" ? round : "round";
    round && this.base.round($round);
    return this;
  }

  integer() {
    this.isInteger && this.addConstraint("integer");
    return this;
  }

  get isInteger() {
    return this.config.isInteger(this.type);
  }

  positive() {
    return this.addConstraint("positive");
  }

  negative() {
    return this.addConstraint("negative");
  }

  get isNegative() {
    const { exclusiveMaximum, negative } = this.constraints;
    if (negative) return true;
    if (exclusiveMaximum === undefined) return false;
    return exclusiveMaximum === 0;
  }

  get isPositive() {
    const { exclusiveMinimum, positive } = this.constraints;
    if (positive) return true;
    if (exclusiveMinimum === undefined) return false;
    return exclusiveMinimum === 0;
  }

  inRange() {
    const $map = this.constraintMap;
    Object.keys($map).map(yupMethod => {
      const names = $map[yupMethod];
      this.checkConstraints(yupMethod, names);
    });
  }

  get constraintMap() {
    return {
      moreThan: ["exclusiveMinimum", "moreThan"],
      lessThan: ["exclusiveMaximum", "lessThan"],
      max: ["maximum", "max"],
      min: ["minimum", "min"]
    };
  }

  checkConstraints(method, names = []) {
    names.map(name => {
      const { constraints } = this;
      const cv = constraints[name];
      if (this.isNothing(cv)) {
        return this;
      }
      if (!this.isNumberLike(cv)) {
        return this.handleNotANumber(name, cv);
      }
      const value = this.toNumber(cv);
      this.addConstraint(name, { method, value });
    });
    return this;
  }

  handleNotANumber(name, value) {
    const msg = `invalid constraint for ${name}, was ${value}. Must be a number or convertible to a number`;
    if (this.config.warnOnInvalid) {
      this.warn(msg);
      return this;
    }
    this.error(msg, value);
    return this;
  }

  normalize() {
    this.constraints.maximum = this.constraints.maximum || this.constraints.max;
    this.constraints.minimum = this.constraints.minimum || this.constraints.min;
  }
}

module.exports = {
  toYupNumber,
  YupNumber,
  NumberHandler
};
