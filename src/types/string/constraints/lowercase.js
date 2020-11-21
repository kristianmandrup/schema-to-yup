import { BaseTypeConstraint } from "../../base-type-constraint";

export const lowercase = (handler, opts) => new Lowercase(handler, opts)

export class Lowercase extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    return this.addConstraint("lowercase");
  }
}