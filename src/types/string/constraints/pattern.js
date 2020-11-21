import { BaseTypeConstraint } from "../../base-type-constraint";

export class Pattern extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
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