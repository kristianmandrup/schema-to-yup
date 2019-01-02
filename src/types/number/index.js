import { YupMixed } from '../mixed';
import { createRangeConstraint, RangeConstraint } from './range-constraint';
import { createNumberGuard, NumberGuard } from './guard';

const proceed = (obj, config = {}) => {
  return createNumberGuard(obj, config).verify();
};

function toYupNumber(obj, config = {}) {
  return proceed(obj, config) && buildYupNumber(obj);
}

function toYupNumberSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

function buildSchemaEntry(obj) {
  return YupNumber.schemaEntryFor(obj);
}

function buildYupNumber(obj) {
  return YupNumber.create(obj);
}

class YupNumber extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.normalizeNumType(obj.type);
    this.base = this.yup.number();
    this.range = createRangeConstraint(this);
  }

  normalizeNumType(type) {
    return type === "int" ? "integer" : type;
  }

  static create(obj) {
    return new YupNumber(obj);
  }

  static schemaEntryFor(obj) {
    return YupNumber.create(obj).createSchemaEntry();
  }

  get enabled() {
    return ["range", "posNeg", "integer"];
  }

  convert() {
    this.enabled.map(name => this.processConstraint(name));
    super.convert();
    return this;
  }

  processConstraint(name) {
    const fn = this[name];
    fn && typeof fn === "function" ? fn.bind(this)() : fn.add();
  }

  truncate() {
    return this.addConstraint("truncate");
  }

  round() {
    const { round } = this.constraints;
    if (this.isNothing(round)) {
      return this;
    }
    const $round = this.isStringType(round) ? round : "round";
    round && this.base.round($round);
    return this;
  }

  posNeg() {
    this.positive();
    this.negative();
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

  normalize() {
    this.constraints.maximum = this.constraints.maximum || this.constraints.max;
    this.constraints.minimum = this.constraints.minimum || this.constraints.min;
  }
}

export {
  toYupNumber,
  toYupNumberSchemaEntry,
  YupNumber,
  createNumberGuard,
  NumberGuard,
  RangeConstraint,
  createRangeConstraint
};
