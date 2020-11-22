import { Loggable } from "../../_loggable";
import { typeMatcher } from "../../_type-matcher";

export class DateHelpers extends Loggable {
  constructor(opts = {}) {
    super(opts)
  }

  toDate(date) {
    return typeMatcher.toDate(date)
  }

  // Yup supports string | Date
  // allow int (number of milliseconds from 1970) via transformToDate
  isValidDateType(date) {
    return typeMatcher.isStringType(date) || typeMatcher.isDateType(date);
  }

  isDateParseable(date) {
    return Boolean(Date.parse(date));
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return typeMatcher.isStringType(date) ? this.isDateParseable(date) : true;
  }

  // optionally transform millisecs to Date value?
  transformToDate(date) {
    return typeMatcher.isNumberType(date) ? this.toDate(date) : date;
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