import { BaseTypeConstraint } from "../../base-type-constraint";

export class Format extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    if (!this.config.format === true) return;
    const format = this.format;
    if (this.yup.prototype[format]) {
      this.addConstraint(this.format);
    }
  }
}