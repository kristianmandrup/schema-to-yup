import { Base } from "../../base";
import * as validators from "..";
import { ObjectDef } from "../../_types";

export class SchemaEntryError extends Error {}

export { Base };

export function createSchemaEntry(opts: any = {}) {
  const { name, key, value, config } = opts;
  const { SchemaEntry = null } = config || {};
  if (!SchemaEntry) {
    throw "missing SchemaEntry class in config";
  }
  return new SchemaEntry({
    name,
    key,
    value,
    config
  }).toEntry();
}

export class SchemaEntry extends Base {
  key: string;
  name: string;
  type: string;
  types: ObjectDef;
  value: ObjectDef;
  config: ObjectDef;

  constructor({ name, key, value, config }) {
    super(config);
    this.key = key;
    this.value = value;
    this.config = config;
    this.name = name;
    this.type = value.type;
    this.types = {
      string: toYupString,
      number: toYupNumberSchemaEntry,
      boolean: toYupBoolean,
      array: toYupArray,
      object: toYupObject,
      date: toYupDate,
      mixed: toYupMixed
    };
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
    return (
      this.string(config) ||
      this.number(config) ||
      this.boolean(config) ||
      this.array(config) ||
      this.object(config) ||
      this.date(config) ||
      this.fallbackType(config)
    );
  }

  // fallback to mixed if no match
  fallbackType(config) {
    this.mixed(config);
  }

  get obj() {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }

  string(obj) {
    return toYupString(obj || this.obj, this.config);
  }

  number(obj) {
    return toYupNumberSchemaEntry(obj || this.obj, this.config);
  }

  boolean(obj) {
    return toYupBoolean(obj || this.obj, this.config);
  }

  array(obj) {
    return toYupArray(obj || this.obj, this.config);
  }

  object(obj) {
    return toYupObject(obj || this.obj, this.config);
  }

  date(obj) {
    return toYupDate(obj || this.obj, this.config);
  }

  mixed(obj) {
    return toYupMixed(obj || this.obj, this.config);
  }
}
