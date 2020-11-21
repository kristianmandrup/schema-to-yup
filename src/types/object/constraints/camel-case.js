import { BaseTypeConstraint } from "../../base-type-constraint";

export const camelCase = (opts) => new CamelCase(opts)

export class CamelCase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("camelCase");
  }
}