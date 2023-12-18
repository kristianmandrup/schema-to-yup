import { YupMixed } from "../mixed";
import { createRangeConstraint, RangeConstraint } from "./range-constraint";
import { createNumberGuard, NumberGuard } from "./guard";

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
    this.type = this.baseType;
    this.base = this.validatorInstance;
    this.rangeConstraint = createRangeConstraint(this);
  }

  get baseType() {
    return this.normalizeNumType(this.opts.type);
  }

  get validatorInstance() {
    return this.validator.number();
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

  // missing round and truncate
  get typeEnabled() {
    return ["range", "posNeg", "integer"];
  }

  convert() {
    super.convert();
    return this;
  }

  range() {
    this.rangeConstraint.add();
    return this;
  }

  // use base.truncate() ?
  truncate() {
    return this.addConstraint("truncate");
  }

  round() {
    const { round } = this.constraints;
    if (this.isNothing(round)) {
      return this;
    }
    const $round = this.isStringType(round) ? round : "round";
    this.base = this.base.round($round);
    return this;
  }

  posNeg() {
    this.positive();
    this.negative();
    return this;
  }

  integer() {
    console.log("try add integer constraint");
    if (!this.isInteger) {
      console.log("not an integer type", this.type);
      return;
    }
    if (!this.base.integer) {
      console.error("invalid base object", this.base);
    }
    this.base = this.base.integer();
    return this;
  }

  get isInteger() {
    return this.config.isInteger(this.value);
  }

  positive() {
    if (!this.isPositive) return this;
    //return this.addConstraint("positive");
    this.base = this.base.positive();
    return this;
  }

  negative() {
    if (!this.isNegative) return this;
    // return this.addConstraint("negative");
    this.base = this.base.negative();
    return this;
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
  createRangeConstraint,
};
