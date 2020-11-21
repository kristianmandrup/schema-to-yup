import { BaseTypeConstraint } from "../../base-type-constraint";

export const minDate = (handler, opts) => new MinDate(handler, opts)

export class MinDate extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { helper, constraints, errorHandler } = this
    const minDate = constraints.minDate || constraints.min;
    const { toDate, transformToDate, isValidDateType, handleInvalidDate } = helper
    const { valErrMessage } = errorHandler

    if (typeMatcher.isNothing(minDate)) {
      return this;
    }
    const $minDate = transformToDate(minDate);
    if (!isValidDateType($minDate)) {
      return handleInvalidDate("minDate", $minDate);
    }
    const newBase =
      $minDate &&
      this.base.min(
        toDate($minDate),
        valErrMessage("minDate") || valErrMessage("min")
      );
    this.base = newBase || this.base;
    return this;
  }
}