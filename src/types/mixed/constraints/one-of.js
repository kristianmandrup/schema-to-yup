import { BaseTypeConstraint } from "../../base-type-constraint";

export const oneOf = (handler, opts) => new OneOf(handler, opts)

export class OneOf extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
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
