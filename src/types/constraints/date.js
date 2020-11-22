import { Constraint } from '../constraints/base';
import { DateHelpers } from '../date/constraints';
import { typeMatcher } from '../_type-matcher';

function createDateConstraint(typer, map) {
  return new DateConstraint(typer, map);
}

class DateConstraint extends Constraint {
  constructor(typer, map = {}) {
    super(typer, map);
    this.helper = new DateHelpers(typer.opts)
  }

  transform(date) {
    return this.helper.toDate(date);
  }

  isValidConstraint(date) {
    return this.isDateLike(date);
  }

  isDateLike(date) {
    return this.isValidDateType(date);
  }

  toDate(date) {
    return typeMatcher.toDate(date);
  }

  isValidDateType(date) {
    return typeMatcher.isStringType(date) || typeMatcher.isDateType(date);
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return typeMatcher.isStringType(date) ? this.isDateParseable(date) : true;
  }

  isDateParseable(date) {
    return this.helper.isDateParseable(date)
  }

  isDateType(date) {
    return typeMatcher.isDateType(date)
  }

  // optionally transform millisecs to Date date?
  transformToDate(date) {
    return typeMatcher.isNumberType(date) ? typeMatcher.toDate(date) : date;
  }

  get explainConstraintValidMsg() {
    return `Must be either: a Date, a number (ms) or a String in date format`;
  }
}

export {
  createDateConstraint,
  DateConstraint
};
