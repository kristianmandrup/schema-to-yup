import { MixedSchemaEntry } from "../mixed/mixed";

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
export class BooleanSchemaEntry extends MixedSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "boolean";
  }

  static create(obj) {
    return new BooleanSchemaEntry(obj);
  }
}
