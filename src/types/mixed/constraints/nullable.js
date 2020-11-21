import { BaseTypeConstraint } from "../../base-type-constraint";

export const nullable = (opts) => new Nullable(opts)

export class Nullable extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const { nullable, isNullable } = this.constraints;
    const value = nullable || isNullable;
    this.addConstraint("nullable", { value, errName: "notOneOf" });
    return this;
  }
}