const { Constraint } = require("../constraints/base");

function createDateConstraint(typer, opts) {
  return new DateConstraint(typer, opts);
}

class DateConstraint extends Constraint {
  constructor(typer, opts = {}) {
    super(typer, opts);
  }

  transform(date) {
    return this.toDate(date);
  }

  isValidConstraint(date) {
    return this.isDateLike(date);
  }

  isDateLike(date) {
    return this.isValidDateType(date);
  }

  toDate(date) {
    return new Date(date);
  }

  isValidDateType(date) {
    return this.isStringType(date) || this.isDateType(date);
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return this.isStringType(date) ? isDateParseable(date) : true;
  }

  isDateParseable(date) {
    return Boolean(Date.parse(date));
  }

  isDateType(date) {
    return date instanceof Date;
  }

  // optionally transform millisecs to Date date?
  transformToDate(date) {
    return this.isNumberType(date) ? this.toDate(date) : date;
  }

  get explainConstraintValidMsg() {
    return `Must be either: a Date, a number (ms) or a String in date format`;
  }
}

module.exports = {
  createDateConstraint,
  DateConstraint
};
