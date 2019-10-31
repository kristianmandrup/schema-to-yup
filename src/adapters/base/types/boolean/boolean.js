import { MixedType } from "../base";

export class BooleanType extends MixedType {
  constructor(obj, config) {
    super(obj, config);
    this.type = "boolean";
  }

  static create(obj) {
    return new BooleanType(obj, config);
  }
}
