import { BaseTypeConstraint } from "../../base-type-constraint";

export const minDate = (handler, opts) => new MinDate(handler, opts)

export class MinDate extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { valErrMessageOr, helper, constraints } = this
    const minDate = constraints.minDate || constraints.min;
    const { toDate, transformToDate, isValidDateType, handleInvalidDate } = helper

    if (typeMatcher.isNothing(minDate)) {
      return this;
    }
    const $minDate = transformToDate(minDate);
    if (!isValidDateType($minDate)) {
      return handleInvalidDate("minDate", $minDate);
    }
    const errMsg = valErrMessageOr("minDate", "min")
    return this.chain(x => $minDate && x.min(toDate($minDate), errMsg))
  }
}