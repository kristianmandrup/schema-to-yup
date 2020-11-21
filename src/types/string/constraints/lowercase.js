import { BaseTypeConstraint } from "../../base-type-constraint";

export const lowercase = (opts) => new Lowercase(opts)

export class Lowercase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("lowercase");
  }
}