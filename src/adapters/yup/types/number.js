import { NumberType as BaseNumberType } from "./base";

export class NumberType extends BaseNumberType {
  static create(obj, config) {
    return new NumberType(obj, config);
  }

  static schemaEntryFor(obj, config) {
    return NumberType.create(obj, config).createInstance();
  }
}
