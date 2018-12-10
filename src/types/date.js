const { YupMixed } = require("./mixed");

class DateHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isDate(obj);
  }

  handle(obj) {
    return this.isBoolean(obj) && YupString.create(obj).yupped();
  }
}

function toYupDate(obj, config = {}) {
  return new DateHandler(config).handle(obj);
}

class YupDate extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "date";
    this.base = this.yup[this.type]();
  }

  static create(obj) {
    return new YupDate(obj);
  }

  convert() {
    this.minDate().maxDate();
    super.convert();
    return this;
  }

  toDate(date) {
    return new Date(date);
  }

  minDate() {
    const minDate = this.constraints.minDate;
    const newBase =
      minDate &&
      this.base.min(
        this.toDate(minDate),
        this.valErrMessage("minDate") || this.valErrMessage("min")
      );
    this.base = newBase || this.base;
    return this;
  }

  maxDate() {
    const maxDate = this.constraints.maxDate;
    const newBase =
      maxDate &&
      this.base.max(
        this.toDate(maxDate),
        this.valErrMessage("maxDate") || this.valErrMessage("max")
      );
    this.base = newBase || this.base;
    return this;
  }
}

module.exports = {
  toYupDate,
  YupDate,
  DateHandler
};
