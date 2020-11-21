import { BaseTypeConstraint } from "../../base-type-constraint";

export const compact = (handler, opts) => new Compact(handler, opts)

export class Compact extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    return this.addConstraint("compact");
  }
}