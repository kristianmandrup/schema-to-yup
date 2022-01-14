import { Base } from "./types";

export class PropertyValueResolverError extends Error {}

export class BasePropertyValueResolver extends Base {
  constructor(opts, config, entryHandler) {
    super(config);
    const { value, type, kind, name, key, schema, types } = opts;
    // this.logInfo('BasePropertyValueResolver', opts)
    this.entryHandler = entryHandler || opts.entryHandler
    this.opts = opts;
    this.kind = kind;
    this.value = value;
    this.schema = schema;
    this.key = key;
    this.value = value || {};
    this.name = name;
    this.type = type;
    this.types = types;
  }

  error(msg, data) {
    const { opts } = this;
    data ? console.error(msg, data, ...opts) : console.error(msg, ...opts);
    throw new PropertyValueResolverError(msg);
  }

  resolve() {
    throw "Must be implemented by subclass";
  }

  get obj() {
    const { schema, key, value, type, kind, config, entryHandler } = this;
    return {
      schema,
      key,
      value,
      type,
      kind,
      config,
      entryHandler
    };
  }
}
