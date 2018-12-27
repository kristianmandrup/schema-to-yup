import { SchemaEntry } from "../base";
import { types } from "./types";

export class SchemaEntryError extends Error {}

export class YupSchemaEntry extends SchemaEntry {
  constructor({ name, key, value, config }) {
    super(config);
    this.key = key;
    this.value = value;
    this.config = config;
    this.name = name;
    this.type = value.type;
    this.types = types;
  }

  isValidSchema() {
    return typeof this.type === "string";
  }

  error(msg) {
    throw new SchemaEntryError(msg);
  }

  toEntry() {
    if (!this.isValidSchema()) this.error("Not a valid schema");
    const config = this.obj;
    // try to find a type specific Yup schema entry
    const typeNames = Object.keys(this.types);
    for (let name of typeNames) {
      const type = this.types[name];
      const entry = type.toSchemaEntry(config);
      if (entry) {
        return entry;
      }
    }
    return this.fallbackType(config);
  }

  // fallback to mixed if no match
  fallbackType(config) {
    this.types.mixed.toSchemaEntry(config);
  }

  get obj() {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }
}
