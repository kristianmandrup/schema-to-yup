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
