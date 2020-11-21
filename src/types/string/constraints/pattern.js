import { BaseTypeConstraint } from "../../base-type-constraint";

export const pattern = (handler, opts) => new Pattern(handler, opts)

export class Pattern extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { pattern, flags } = this.constraints;
    if (!pattern) {
      return this;
    }
    const regex = new RegExp(pattern, flags);
    const errMsg =
      this.valErrMessage("pattern") ||
      this.valErrMessage("matches") ||
      this.valErrMessage("regex");

    const newBase = regex && this.base.matches(regex, errMsg);
    this.base = newBase || this.base;
    return this;
  }
}