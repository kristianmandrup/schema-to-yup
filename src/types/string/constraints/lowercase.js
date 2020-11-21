import { BaseTypeConstraint } from "../../base-type-constraint";

export class Lowercase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("lowercase");
  }
}