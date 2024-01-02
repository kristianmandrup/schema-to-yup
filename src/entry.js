import {
  Base,
  toYupString,
  toYupNumberSchemaEntry,
  toYupBoolean,
  toYupArray,
  toYupObject,
  toYupDate,
  toYupNull,
} from "./types";

import { createPropertyValueResolver } from "./property-value-resolver";

class YupSchemaEntryError extends Error {}

class YupSchemaEntry extends Base {
  constructor(opts) {
    super(opts.config);
    const { schema, name, key, value, config, builder, parentNode } = opts;
    this.parentNode = parentNode;
    this.builder = builder;
    this.opts = opts;
    this.schema = schema;
    this.key = key;
    this.value = value || {};
    this.config = config || {};
    this.name = name;
    this.init();
  }

  get calcType() {
    const { value } = this;
    return Array.isArray(value) ? "array" : value.type;
  }

  get calcKind() {
    return this.type === "array" ? "multi" : "single";
  }

  createNew(opts) {
    return new YupSchemaEntry(opts).toEntry();
  }

  init() {
    this.type = this.calcType;
    this.kind = this.calcKind;
    this.setTypeHandlers();
    this.setPropertyHandler();
  }

  get validator() {
    return this.builder && this.builder.validator;
  }

  setPropertyHandler() {
    const { config } = this;
    const opts = this.propertyHandlerOpts;
    const createPropertyValueHandlerFn =
      config.createPropertyValueHandler || this.createPropertyValueHandler;
    this.propertyValueHandler = createPropertyValueHandlerFn(opts, config);
  }

  get propertyHandlerOpts() {
    const { types, value, name, key, type, kind, schema, parentNode } = this;
    return {
      type,
      parentNode,
      kind,
      types,
      value,
      name,
      key,
      schema,
      entryHandler: this,
    };
  }

  createPropertyValueHandler(opts, config) {
    return createPropertyValueResolver(opts, config, this);
  }

  get defaultTypeHandlerMap() {
    return {
      null: toYupNull,
      string: toYupString,
      number: toYupNumberSchemaEntry,
      boolean: toYupBoolean,
      array: toYupArray,
      object: toYupObject,
      date: toYupDate,
    };
  }

  setTypeHandlers() {
    this.types = this.config.types || this.typeHandlers;
  }

  get typeHandlers() {
    return {
      ...this.defaultTypeHandlerMap,
      ...(this.config.typeHandlers || {}),
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
