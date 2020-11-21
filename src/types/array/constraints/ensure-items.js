import { BaseTypeConstraint } from "../../base-type-constraint";

export const ensureItems = (opts) => new EnsureItems(opts)

export class EnsureItems extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("ensure");
  }
}