import { BaseTypeConstraint } from "../../base-type-constraint";

export class Integer extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    this.isInteger && this.addConstraint("integer");
    return this;
  }

  get isInteger() {
    return this.config.isInteger(this.type);
  }
}