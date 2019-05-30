import { NumberSchemaEntry } from "./number";
import { createNumberGuard } from "./guard";

export { createNumberGuard };

const proceed = (obj, config = {}) => {
  return createNumberGuard(obj, config).verify();
};

export function toNumber(obj, config = {}) {
  return proceed(obj, config) && buildNumber(obj);
}

export function toSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

export function buildSchemaEntry(obj) {
  return NumberSchemaEntry.schemaEntryFor(obj);
}

export function buildNumber(obj) {
  return NumberSchemaEntry.create(obj);
}
