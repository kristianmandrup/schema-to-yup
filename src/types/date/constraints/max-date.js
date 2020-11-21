import { BaseTypeConstraint } from "../../base-type-constraint";

export class MaxDate extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
  }

  process() {
    const maxDate = this.constraints.maxDate || this.constraints.max;
    if (typeMatcher.isNothing(maxDate)) {
      return this;
    }
    const $maxDate = this.transformToDate(maxDate);
    if (!this.isValidDateType($maxDate)) {
      return this.handleInvalidDate("maxDate", $maxDate);
    }
    const newBase =
      $maxDate &&
      this.base.max(
        this.toDate($maxDate),
        this.valErrMessage("maxDate") || this.valErrMessage("max")
      );
    this.base = newBase || this.base;
    return this;
  }
}