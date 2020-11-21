import { BaseTypeConstraint } from "../../base-type-constraint";

export const constantCase = (opts) => new ConstantCase(opts)

export class ConstantCase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("constantCase");
  }
}