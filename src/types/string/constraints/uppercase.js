import { BaseTypeConstraint } from "../../base-type-constraint";

export class Uppercase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("uppercase");
  }
}