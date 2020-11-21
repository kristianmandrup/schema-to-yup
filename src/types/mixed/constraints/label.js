import { BaseTypeConstraint } from "../../base-type-constraint";

export const label = (opts) => new Label(opts)

export class Label extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    if (!this.title) return this
    this.base = this.base.label(this.title)
    return this
  }

  get title() {
    return this.value.title
  }
}