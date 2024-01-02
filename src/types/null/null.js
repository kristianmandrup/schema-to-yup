import { YupMixed } from "../mixed";

export class YupNull extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.baseType;
    this.base = this.validatorInstance;
  }

  get baseType() {
    return "null";
  }

  get validatorInstance() {
    return this.validator.null();
  }

  static create(obj) {
    return new YupNull(obj);
  }
}
