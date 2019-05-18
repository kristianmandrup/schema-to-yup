import { MixedSchemaEntry } from "../mixed/mixed";
import { createStringGuard, StringGuard } from "./guard";

const proceed = (obj, config = {}) => {
  return createStringGuard(obj, config).verify();
};

export function toSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

export function buildSchemaEntry(obj) {
  return StringSchemaEntry.schemaEntryFor(obj);
}

export function createSchemaEntry(obj) {
  return StringSchemaEntry.create(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
