import { YupMixed } from "../mixed";
import * as Yup from 'yup'

export class YupDate extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.baseType;
    this.base = this.validatorInstance;
  }

  get baseType() {
    return "date";
  }

  get validatorInstance() {
    return this.validator.date();
  }

  static create(obj) {
    return new YupDate(obj);
  }

  get typeEnabled() {
    return ["minDate", "maxDate"];
  }

  convert() {
    super.convert();
    return this;
  }

  // TODO: use Yup.ref if string and not a date format
  toDate(date) {
    const isDateRef = this.isStringType(date) && !this.isValidDateFormat(date)
    return isDateRef ? Yup.ref(date) : new Date(date)    
  }

  // Yup supports string | Date
  // allow int (number of milliseconds from 1970) via transformToDate
  isValidDateType(date) {
    return this.isStringType(date) || this.isDateType(date);
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    // const parsedDate = Date.parse(date)
    // const validDateFormat = Boolean(parsedDate)
    return true// this.isStringType(date) ? validDateFormat : true;
  }

  isValidDateFormat(date) {
    try {
      const parsedDate = Date.parse(date)
      return Boolean(parsedDate)
    } catch (e) {
      return false
    }
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
        this.validationErrorMessage("minDate") || this.validationErrorMessage("min")
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
        this.validationErrorMessage("maxDate") || this.validationErrorMessage("max")
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
