import { BaseTypeConstraint } from "../../base-type-constraint";

export const oneOf = (opts) => new OneOf(opts)

export class OneOf extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    let values = this.constraints.enum || this.constraints.oneOf || this.constraints.anyOf;
    if (typeMatcher.isNothing(values)) return this;
    values = Array.isArray(values) ? values : [values];
    // using alias
    const alias = ["oneOf", "enum", "anyOf"].find(key => {
      return this.constraints[key] !== undefined;
    });
    // TODO: pass value as constraintValue not value
    return this.addConstraint(alias, { values });
  }
}
