import { BaseTypeConstraint } from "../../base-type-constraint";

export const isType = (opts) => new IsType(opts)

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