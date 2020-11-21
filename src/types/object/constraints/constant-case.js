import { BaseTypeConstraint } from "../../base-type-constraint";

export const constantCase = (opts) => new ConstantCase(opts)

export class ConstantCase extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    return this.addConstraint("constantCase");
  }
}