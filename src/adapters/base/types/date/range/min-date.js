export class MinDate {
  minDate() {
    const minDate = this.constraints.minDate || this.constraints.min;
    if (this.isNothing(minDate)) {
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
