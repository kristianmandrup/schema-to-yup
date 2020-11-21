import { YupMixed } from "../mixed";

export class YupDate extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "date";
    this.base = this.yup.date();
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
}
