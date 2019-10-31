export class DateValidator {
  // Yup supports string | Date
  // allow int (number of milliseconds from 1970) via transformToDate
  isValidDateType(date) {
    return this.isStringType(date) || this.isDateType(date);
  }

  isValidDate(date) {
    if (!this.isValidDateType(date)) return false;
    return this.isStringType(date) ? Boolean(Date.parse(date)) : true;
  }
}
