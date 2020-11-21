import { BaseTypeConstraint } from "../../base-type-constraint";

export class Compact extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("compact");
  }
}