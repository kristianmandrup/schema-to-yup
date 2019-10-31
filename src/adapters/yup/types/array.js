import { BaseType as BasicType } from "../base";

export class ArrayType extends BasicType {
  constructor(obj, config) {
    super(obj, config);
  }

  static create(obj, config) {
    return new ArrayType(obj, config);
  }
}
