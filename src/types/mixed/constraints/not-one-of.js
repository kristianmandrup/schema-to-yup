import { BaseTypeConstraint } from "../../base-type-constraint";

export const notOneOf = (handler, opts) => new NotOneOf(handler, opts)

export class NotOneOf extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
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