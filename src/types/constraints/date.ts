const { Constraint } = require("../constraints/base");

function createDateConstraint(typer, opts) {
  return new DateConstraint(typer, opts);
}

class DateConstraint extends Constraint {
  constructor(typer, opts = {}) {
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

  toDate(date) {
    try {
      return new Date(date);
    } catch (err) {
      this.error("toDate: Invalid date", {
        date
      });
    }
  }

  isValidDateType(date) {
    return (
      this.isStringType(date) ||
      this.isNumberType(date) ||
      this.isDateType(date)
    );
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return this.isStringType(date) ? this.isDateParseable(date) : true;
  }

  isDateParseable(date) {
    if (!this.isStringType(date)) return false;
    return Boolean(Date.parse(date));
  }

  isDateType(date) {
    return date instanceof Date;
  }

  // optionally transform millisecs to Date date?
  transformToDate(date) {
    if (!this.isValidDate(date)) {
      return this.error(
        "transformToDate: value cannot be transformed to a date",
        {
          date
        }
      );
    }
    return this.isNumberType(date) || this.isDateParseable(date)
      ? this.toDate(date)
      : date;
  }

  get explainConstraintValidMsg() {
    return `Must be either: a Date, a number (ms) or a String in date format`;
  }
}

module.exports = {
  createDateConstraint,
  DateConstraint
};
