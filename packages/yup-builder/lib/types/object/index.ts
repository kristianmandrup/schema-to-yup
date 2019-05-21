import { createObjectGuard } from "./guard";
import { ObjectSchemaEntry } from "./object";

const proceed = (obj, config = {}) => {
  return createObjectGuard(obj, config).verify();
};

export function toSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

export function buildSchemaEntry(obj) {
  return ObjectSchemaEntry.schemaEntryFor(obj);
}

export function createSchemaEntry(obj) {
  return ObjectSchemaEntry.create(obj);
}

