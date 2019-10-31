import { BaseType } from "../base";
import { createRangeConstraint } from "./range-constraint";

export class NumberType extends BaseType {
  constructor(obj) {
    super(obj);
    this.type = this.normalizeNumType(obj.type);
    this.range = createRangeConstraint(this);
  }

  normalizeNumType(type) {
    return type === "int" ? "integer" : type;
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

  get constraintNames() {
    return ["truncate", "positive", "negative"];
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
