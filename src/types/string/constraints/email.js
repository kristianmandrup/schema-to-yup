import { BaseTypeConstraint } from "../../base-type-constraint";

export class Email extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
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