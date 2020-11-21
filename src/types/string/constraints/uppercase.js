import { BaseTypeConstraint } from "../../base-type-constraint";

export const uppercase = (opts) => new Uppercase(opts)

export class Uppercase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("uppercase");
  }
}