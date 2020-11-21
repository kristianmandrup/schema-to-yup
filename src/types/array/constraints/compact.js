import { BaseTypeConstraint } from "../../base-type-constraint";

export const compact = (opts) => new Compact(opts)

export class Compact extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("compact");
  }
}