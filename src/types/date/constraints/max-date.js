import { BaseTypeConstraint } from "../../base-type-constraint";

export const maxDate = (handler, opts) => new MaxDate(handler, opts)

export class MaxDate extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)    
    this.init()
  }

  init() {
    super.init()
    this.helper = new DateHelpers(this.opts)
  }

  process() {
    const { toDate, transformToDate, isValidDateType, handleInvalidDate } = this.helper
    const { valErrMessage } = this.errorHandler
    const maxDate = this.constraints.maxDate || this.constraints.max;
    if (typeMatcher.isNothing(maxDate)) {
      return this;
    }
    const $maxDate = transformToDate(maxDate);
    if (!isValidDateType($maxDate)) {
      return handleInvalidDate("maxDate", $maxDate);
    }
    const newBase =
      $maxDate &&
      this.base.max(
        toDate($maxDate),
        this.valErrMessage("maxDate") || this.valErrMessage("max")
      );
    this.base = newBase || this.base;
    return this;
  }
}