import { BaseTypeConstraint } from "../../base-type-constraint";

export const uppercase = (handler, opts) => new Uppercase(handler, opts)

export class Uppercase extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    return this.addConstraint("uppercase");
  }
}