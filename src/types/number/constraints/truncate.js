import { BaseTypeConstraint } from "../../base-type-constraint";

export class Truncate extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("truncate");
  }
}


