import { BaseTypeConstraint } from "../../base-type-constraint";
import { typeMatcher } from "../../_type-matcher";

export const email = (handler, opts) => new Email(handler, opts)

export class Email extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    if (!this.isEmail) return this;
    const constraintName = this.constraintNameFor("email", "format");
    const method = "email";
    this.addConstraint("email", {
      constraintValue: true,
      constraintName,
      method,
      errName: method
    });
    return this;
  }

  get isEmail() {
    return this.constraints.email || this.format === "email";
  }
}