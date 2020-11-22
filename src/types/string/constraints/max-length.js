import { BaseTypeConstraint } from "../../base-type-constraint";

export const maxLength = (handler, opts) => new maxLength(handler, opts)

export class MaxLength extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { constraints, valErrMessageOr } = this
    const { maxLength } = constraints;
    const errMsg = valErrMessage("maxLength", "max");
    return this.chain(x => maxLength && x.max(maxLength, errMsg))
  }
}