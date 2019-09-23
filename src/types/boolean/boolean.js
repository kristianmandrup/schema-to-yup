import { YupMixed } from "../mixed";

export class YupBoolean extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "boolean";
    this.base = this.yup.boolean();
  }

  static create(obj) {
    return new YupBoolean(obj);
  }
}
