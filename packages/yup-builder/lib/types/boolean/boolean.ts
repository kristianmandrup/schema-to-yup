import { MixedSchemaEntry } from "../mixed";
import { createBooleanGuard } from "./guard";

export function proceed(obj, config = {}) {
  return obj && createBooleanGuard(obj, config).isValid();
}

export function toSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && createSchemaEntry(obj);
}

export function createSchemaEntry(obj) {
  return BooleanSchemaEntry.create(obj);
}

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
