import { BaseTypeConstraint } from "../../base-type-constraint";

export class NotOneOf extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const { not, notOneOf } = this.constraints;
    let values = notOneOf || (not && (not.enum || not.oneOf));
    if (typeMatcher.isNothing(values)) return this;
    values = Array.isArray(values) ? values : [values];
    // TODO: pass value as constraintValue not value
    return this.addConstraint("notOneOf", { values });
  }  
}