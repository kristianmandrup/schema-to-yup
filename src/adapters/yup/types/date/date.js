import { MixedType } from "../base";

export class DateType extends MixedType {
  constructor(obj, config) {
    super(obj, config);
    this.type = "date";
  }

  static create(obj, config) {
    return new YupDate(obj, config);
  }

  convert() {
    this.minDate();
    this.maxDate();
    super.convert();
    return this;
  }

  toDate(date) {
    return new Date(date);
  }

  // Yup supports string | Date
  // allow int (number of milliseconds from 1970) via transformToDate
  isValidDateType(date) {
    return this.isStringType(date) || this.isDateType(date);
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return this.isStringType(date) ? Boolean(Date.parse(date)) : true;
  }

  // optionally transform millisecs to Date value?
  transformToDate(date) {
    return this.isNumberType(date) ? new Date(date) : date;
  }

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

  maxDate() {
    const maxDate = this.constraints.maxDate || this.constraints.max;
    if (this.isNothing(maxDate)) {
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

  handleInvalidDate(name, value) {
    const msg = `invalid constraint for ${name}, was ${value}. Must be a number, string (valid date format) or a Date instance`;
    if (this.config.warnOnInvalid) {
      this.warn(msg);
      return this;
    }
    this.error(msg, value);
    return this;
  }
}
