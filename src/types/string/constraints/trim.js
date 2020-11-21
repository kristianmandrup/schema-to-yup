import { BaseTypeConstraint } from "../../base-type-constraint";

export class Trim extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("trim");
  }
}