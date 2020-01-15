import {
  Base,
  toYupString,
  toYupNumberSchemaEntry,
  toYupBoolean,
  toYupArray,
  toYupObject,
  toYupDate
} from "./types";

import { createPropertyValueResolver } from "./property-value-resolver";

class YupSchemaEntryError extends Error {}

class YupSchemaEntry extends Base {
  constructor(opts) {
    super(opts.config);
    const { schema, name, key, value, config } = opts;
    this.opts = opts;
    this.schema = schema;
    this.key = key;
    this.value = value || {};
    this.config = config || {};
    this.name = name;
    const type = Array.isArray(value) ? "array" : value.type;
    this.kind = type === "array" ? "multi" : "single";
    this.type = type;
    this.setTypeHandlers();
    this.setPropertyHandler();
  }

  setPropertyHandler() {
    const { config, types, value, name, key, type, kind, schema } = this;
    const opts = {
      type,
      kind,
      types,
      value,
      name,
      key,
      schema
    };
    const createPropertyValueHandlerFn =
      config.createPropertyValueHandler || this.createPropertyValueHandler;
    this.propertyValueHandler = createPropertyValueHandlerFn(opts, config);
  }

  createPropertyValueHandler(opts, config) {
    return createPropertyValueResolver(opts, config);
  }

  get defaultTypeHandlerMap() {
    return {
      string: toYupString,
      number: toYupNumberSchemaEntry,
      boolean: toYupBoolean,
      array: toYupArray,
      object: toYupObject,
      date: toYupDate
    };
  }

  setTypeHandlers() {
    this.types = {
      ...this.defaultTypeHandlerMap,
      ...(this.config.typeHandlers || {})
    };
  }

  isValidSchema() {
    const { type } = this;
    return this.isStringType(type);
  }

  error(msg, data) {
    const { opts } = this;
    data ? console.error(msg, data, ...opts) : console.error(msg, ...opts);
    throw new YupSchemaEntryError(msg);
  }

  toEntry() {
    if (!this.isValidSchema()) {
      const schema = JSON.stringify(this.schema);
      this.error(
        `Not a valid schema: type ${
          this.type
        } must be a string, was ${typeof this.type} ${schema}`
      );
    }
    const { opts, config } = this;
    return this.propertyValueHandler.resolve(opts, config);
  }
}

export { YupSchemaEntryError, YupSchemaEntry, Base };
