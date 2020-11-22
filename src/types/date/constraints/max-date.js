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
    const { valErrMessageOr, constraints, helper } = this
    const { toDate, transformToDate, isValidDateType, handleInvalidDate } = helper    
    const maxDate = constraints.maxDate || constraints.max;
    if (typeMatcher.isNothing(maxDate)) {
      return this;
    }
    const $maxDate = transformToDate(maxDate);
    if (!isValidDateType($maxDate)) {
      return handleInvalidDate("maxDate", $maxDate);
    }
    const errMsg = valErrMessageOr("maxDate", "max")
    return this.chain(x => $maxDate && x.max(toDate($maxDate), errMsg))
  }
}