import { BaseTypeConstraint } from "../../base-type-constraint";

export const isType = (handler, opts) => new IsType(handler, opts)

export class IsType extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const value = this.constraints.isType;
    this.addConstraint("isType", { value, errName: "notOneOf" });
    return this;
  }
}