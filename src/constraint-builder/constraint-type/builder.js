import {
  NoValueConstraintBuilder,
  SingleValueConstraintBuilder,
  ListValueConstraintBuilder
} from "../constraint-type";

export class ConstraintTypeBuilder {
  constraintWithSingleValue(constraintValue, opts = {}) {
    if (!this.isPresent(constraintValue)) return;
    return this.createSingleValueConstraintBuilder(opts).build(constraintValue);
  }

  constraintWithValues(values, opts = {}) {
    if (!this.isPresent(values)) return;
    return this.createListValueConstraintBuilder(opts).build(values);
  }

  constraintWithNoValue(opts = {}) {
    return this.createNoValueConstraintBuilder(opts).build(opts.name, opts);
  }

  createNoValueConstraintBuilder(opts = {}) {
    return new NoValueConstraintBuilder(opts);
  }

  createListValueConstraintBuilder(opts = {}) {
    return new ListValueConstraintBuilder(opts);
  }

  createSingleValueConstraintBuilder(opts = {}) {
    return new SingleValueConstraintBuilder(opts);
  }
}
