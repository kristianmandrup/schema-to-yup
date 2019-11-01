import {
  Base,
  toYupString,
  toYupNumberSchemaEntry,
  toYupBoolean,
  toYupArray,
  toYupObject,
  toYupDate
} from "./types";

class YupSchemaEntryError extends Error {}

class YupSchemaEntry extends Base {
  constructor({ schema, name, key, value, config }) {
    super(config);
    this.schema = schema;
    this.key = key;
    this.value = value || {};
    this.config = config || {};
    this.name = name;
    this.type = value.type;
    this.setTypeHandlers();
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
    return typeof this.type === "string";
  }

  error(msg) {
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
    const { obj, config } = this;
    const typeHandlerNames = Object.keys(this.types);
    // TODO: iterate all registered type handlers in this.types
    for (let typeName of typeHandlerNames) {
      const typeFn = this.types[typeName];
      const result = typeFn(obj, config);
      if (result) return result;
    }
    return this.defaultType(config);
  }

  defaultType(config) {
    // return this.mixed(config)
    this.error("toEntry: unknown type", config);
  }

  get obj() {
    return {
      schema: this.schema,
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }
}

export { YupSchemaEntryError, YupSchemaEntry, Base };
