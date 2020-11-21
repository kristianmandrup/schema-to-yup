import { BaseTypeConstraint } from "../../base-type-constraint";

export class Url extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    if (!this.isUrl) return this;
    const constraintName = this.constraintNameFor("url", "format");
    const method = "url";
    this.addConstraint("url", {
      constraintValue: true,
      constraintName,
      method,
      errName: method
    });
    return this;
  }

  get isUrl() {
    return this.constraints.url || this.format === "url";
  }
}