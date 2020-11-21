import { BaseTypeConstraint } from "../../base-type-constraint";

export const label = (handler, opts) => new Label(handler, opts)

export class Label extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    if (!this.title) return this
    this.chainYup(x => x.label(this.title))
  }

  get title() {
    return this.value.title
  }
}