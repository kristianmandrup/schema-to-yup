import { YupMixed } from "../mixed";

export class YupBoolean extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.baseType;
    this.base = this.validatorInstance;
  }

  get baseType() {
    return "boolean";
  }

  get validatorInstance() {
    return this.validator.boolean();
  }

  static create(obj) {
    return new YupBoolean(obj);
  }
}
