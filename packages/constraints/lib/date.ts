import { Constraint, util } from "./constraint";
const { isNumberType, isStringType, isDateType } = util;

export function createDateConstraint(typer, opts) {
  return new DateConstraint(typer, opts);
}

export class DateConstraint extends Constraint {
  constructor(typer, opts: any = {}) {
    super(typer, opts);
  }

  transform(date) {
    return this.transformToDate(date);
  }

  isValidConstraintValue(date) {
    return this.isDateLike(date);
  }

  isDateLike(date) {
    return this.isValidDate(date);
  }

  isValidDateType(date) {
    return isStringType(date) || isNumberType(date) || isDateType(date);
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return isStringType(date) ? this.isDateParseable(date) : true;
  }

  isDateParseable(date) {
    if (!isStringType(date)) return false;
    return Boolean(Date.parse(date));
  }

  isDateType(date) {
    return date instanceof Date;
  }

  // optionally transform millisecs to Date date?
  transformToDate(date) {
    this.validateDate(date);
    return isNumberType(date) || this.isDateParseable(date)
      ? this.toDate(date)
      : date;
  }

  toDate(date) {
    try {
      return new Date(date);
    } catch (err) {
      this.error("toDate", "Invalid date", {
        date
      });
    }
  }

  validateDate(date) {
    if (!this.isValidDate(date)) {
      return this.error(
        "transformToDate",
        "value cannot be transformed to a date",
        {
          date
        }
      );
    }
  }

  get explainConstraintValidMsg() {
    return `Must be either: a Date, a number (ms) or a String in date format`;
  }
}
