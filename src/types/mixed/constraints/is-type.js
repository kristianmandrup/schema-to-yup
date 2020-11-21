import { BaseTypeConstraint } from "../../base-type-constraint";

export class IsType extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const value = this.constraints.isType;
    this.addConstraint("isType", { value, errName: "notOneOf" });
    return this;
  }
}