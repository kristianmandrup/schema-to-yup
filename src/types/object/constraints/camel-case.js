import { BaseTypeConstraint } from "../../base-type-constraint";

export class CamelCase extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    return this.addConstraint("camelCase");
  }
}