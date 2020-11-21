import { BaseTypeConstraint } from "../../base-type-constraint";

export const minDate = (handler, opts) => new MinDate(handler, opts)

export class MinDate extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const minDate = this.constraints.minDate || this.constraints.min;
    if (typeMatcher.isNothing(minDate)) {
      return this;
    }
    const $minDate = this.transformToDate(minDate);
    if (!this.isValidDateType($minDate)) {
      return this.handleInvalidDate("minDate", $minDate);
    }
    const newBase =
      $minDate &&
      this.base.min(
        this.toDate($minDate),
        this.valErrMessage("minDate") || this.valErrMessage("min")
      );
    this.base = newBase || this.base;
    return this;
  }
}