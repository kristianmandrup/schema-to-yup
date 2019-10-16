import { Loggable } from "../../_loggable";
import { yupContraintFnFor, yupTypeFor } from "../utils";

export class Constraint extends Loggable {
  constructor(opts = {}) {
    super(opts);
    const {
      constraintName,
      errFn,
      yupConstraintMethodName,
      method,
      onConstraintAdded,
      type
    } = opts;
    let { constraintFn, yupTypeInst } = opts;
    yupTypeInst = yupTypeInst || yupTypeFor(type);
    const methodName = method || yupConstraintMethodName;

    constraintFn =
      constraintFn ||
      yupContraintFnFor({
        methodName,
        type,
        yupTypeInst
      });

    this.validateConstraintOpts({ constraintFn, ...opts });
    this.yupTypeInst = yupTypeInst;
    this.errFn = errFn;
    this.constraintFn = constraintFn;
    this.constraintName = constraintName;
    this.onConstraintAdded = onConstraintAdded;
  }

  build(value) {
    const { constraintName, onConstraintAdded } = this;
    onConstraintAdded && onConstraintAdded({ name: constraintName, value });

    if (!this.isPresent(value) || !this.isValidValue(value)) {
      return false;
    }
    return true;
  }

  isValidValue(_) {
    return true;
  }

  validateConstraintOpts(opts) {
    ["constraintFn"].map(
      name => this.isNothing(opts[name]) && this.missingConstraintOpt(name)
    );
  }

  missingConstraintOpt(name) {
    this.error(`Constraint: missing ${name}`);
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }
}
