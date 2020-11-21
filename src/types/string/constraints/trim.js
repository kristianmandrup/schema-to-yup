import { BaseTypeConstraint } from "../../base-type-constraint";

export const trim = (opts) => new Trim(opts)

export class Trim extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("trim");
  }
}