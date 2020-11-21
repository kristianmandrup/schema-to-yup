import { BaseTypeConstraint } from "../../base-type-constraint";

export class EnsureItems extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("ensure");
  }
}