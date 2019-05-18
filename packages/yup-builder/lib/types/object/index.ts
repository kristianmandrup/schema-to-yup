import { MixedSchemaEntry } from "../mixed/mixed";
import { createObjectGuard } from "./guard";
import { ObjectDef } from "../../../../common/_types";

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

