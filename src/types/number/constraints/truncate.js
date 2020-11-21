import { BaseTypeConstraint } from "../../base-type-constraint";

export const truncate = (opts) => new Truncate(opts)

export class Truncate extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("truncate");
  }
}


