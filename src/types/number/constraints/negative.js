import { BaseTypeConstraint } from "../../base-type-constraint";

export const negative = (handler, opts) => new Negative(handler, opts)

export class Negative extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    return this.isNegative && this.addConstraint("negative");
  }

  get isNegative() {
    const { exclusiveMaximum, negative } = this.constraints;
    if (negative) return true;
    if (exclusiveMaximum === undefined) return false;
    return exclusiveMaximum === 0;
  }  
}


