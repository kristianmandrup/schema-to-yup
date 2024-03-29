import { Base } from "./types";

export class PropertyValueResolverError extends Error {}

export class BasePropertyValueResolver extends Base {
  constructor(opts, config, entryHandler) {
    super(config);
    const { value, type, kind, name, key, schema, types, parentNode } = opts;
    // this.logInfo('BasePropertyValueResolver', opts)
    this.entryHandler = entryHandler || opts.entryHandler;
    this.parentNode = parentNode;
    this.builder = opts.builder;
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

  get validator() {
    return this.builder.validator;
  }

  error(msg, data) {
    let { opts } = this;
    opts = opts || {};
    opts = data ? { data, ...opts } : opts;
    console.error(msg, ...opts);
    throw new PropertyValueResolverError(msg);
  }

  resolve() {
    throw "Must be implemented by subclass";
  }

  get obj() {
    const { schema, key, value, type, kind, config, entryHandler, parentNode } =
      this;
    return {
      schema,
      parentNode,
      key,
      value,
      type,
      kind,
      config,
      entryHandler,
    };
  }
}
