import { BaseTypeConstraint } from "../../base-type-constraint";

export const minLength = (handler, opts) => new MinLength(handler, opts)

export class MinLength extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { constraints, valErrMessageOr } = this
    const { minLength } = constraints;
    const errMsg = valErrMessageOr("minLength", "min");
    return this.chain(x => minLength && x.min(minLength, errMsg));
  }
}