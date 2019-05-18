import { MixedSchemaEntry } from "./mixed";
import { Guard } from "./guard";

export class BooleanGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isBoolean(obj) {
    return this.config.isBoolean(obj);
  }

  validate(obj) {
    return (
      this.isBoolean(obj) && BooleanSchemaEntry.create(obj).createSchemaEntry()
    );
  }
}

export function createBooleanGuard(obj, config = {}) {
  return new BooleanGuard(obj, config);
}

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
