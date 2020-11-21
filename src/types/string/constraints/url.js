import { BaseTypeConstraint } from "../../base-type-constraint";

export const url = (handler, opts) => new Url(handler, opts)

export class Url extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
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