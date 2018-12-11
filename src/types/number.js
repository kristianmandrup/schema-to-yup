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
    this.minimum()
      .maximum()
      .positive()
      .negative()
      .integer()
      .moreThan()
      .lessThan();
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

  moreThan() {
    const min = this.$moreThan;
    const newBase = min && this.base.moreThan(this.toNumber(min));
    this.base = newBase || this.base;
    return this;
  }

  lessThan() {
    const max = this.$lessThan;
    const newBase = max && this.base.lessThan(this.toNumber(max));
    this.base = newBase || this.base;
    return this;
  }

  get $moreThan() {
    const { exclusiveMinimum, moreThan } = this.constraints;
    if (moreThan) return moreThan;
    if (exclusiveMinimum === undefined) return false;
    return exclusiveMinimum;
  }

  get $lessThan() {
    const { exclusiveMaximum, lessThan } = this.constraints;
    if (lessThan) return lessThan;
    if (exclusiveMaximum === undefined) return false;
    return exclusiveMaximum;
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

  minimum() {
    const { constraints } = this;
    const min = constraints.minimum || constraints.min;
    if (this.isNothing(min)) {
      return this;
    }
    if (!this.isNumberLike(min)) {
      return this.handleNotANumber("minimum", min);
    }
    const $min = this.toNumber(min);
    const newBase = this.base.max($min, this.valErrMessage("minimum"));
    this.base = newBase || this.base;
    return this;
  }

  maximum() {
    const { constraints } = this;
    const max = constraints.maximum || constraints.max;
    if (this.isNothing(max)) {
      return this;
    }
    if (!this.isNumberLike(max)) {
      return this.handleNotANumber("maximum", max);
    }
    const $max = this.toNumber(max);
    const newBase = this.base.max($max, this.valErrMessage("maximum"));
    this.base = newBase || this.base;
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
