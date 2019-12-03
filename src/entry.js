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
  constructor(opts) {
    super(opts.config);
    const { schema, name, key, value, config } = opts;
    this.opts = opts;
    this.schema = schema;
    this.key = key;
    this.value = value || {};
    this.config = config || {};
    this.name = name;
    this.type = Array.isArray(value) ? "array" : value.type;
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

  error(msg, data) {
    data
      ? console.error(msg, data, ...this.opts)
      : console.error(msg, ...this.opts);
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
    return this.toMultiType() || this.toSingleType() || this.toDefaultEntry();
  }

  toMultiType() {
    const { value } = this;
    if (!Array.isArray(value)) return;
    const toMultiType = this.config.toMultiType;
    if (toMultiType) {
      return toMultiType(this);
    }
    // TODO
    return;
  }

  toSingleType() {
    const { value } = this;
    if (Array.isArray(value)) return;
    const toSingleType = this.config.toSingleType;
    if (toSingleType) {
      return toSingleType(this);
    }

    const { obj, config } = this;
    const typeHandlerNames = Object.keys(this.types);
    let result;
    // iterate all registered type handlers in this.types
    for (let typeName of typeHandlerNames) {
      const typeFn = this.types[typeName];
      if (typeFn) {
        result = typeFn(obj, config);
      }
      if (result) break;
    }
    return result;
  }

  toDefaultEntry() {
    return this.defaultType();
  }

  defaultType() {
    // return this.mixed(config)
    this.error("toEntry: unknown type", this.type);
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
