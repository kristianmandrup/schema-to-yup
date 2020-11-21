import { BaseTypeConstraint } from "../../base-type-constraint";

export class ConstantCase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("constantCase");
  }
}