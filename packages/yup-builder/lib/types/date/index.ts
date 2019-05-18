import { DateSchemaEntry } from "./date";
const { createDateGuard } = require("./guard");

const proceed = (obj, config = {}) => {
  return createDateGuard(obj, config).verify();
};

export function toDate(obj, config = {}) {
  return proceed(obj, config) && buildDate(obj);
}

export function toSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

export function buildSchemaEntry(obj) {
  return DateSchemaEntry.schemaEntryFor(obj);
}

export function buildDate(obj) {
  return DateSchemaEntry.create(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
