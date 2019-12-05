import { Base } from "./types";

export class PropertyValueResolverError extends Error {}

export class BasePropertyValueResolver extends Base {
  constructor(opts, config) {
    super(config);
    const { value, type, kind, name, key, schema, types } = opts;
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
    data
      ? console.error(msg, data, ...this.opts)
      : console.error(msg, ...this.opts);
    throw new PropertyValueResolverError(msg);
  }

  resolve() {
    throw "Must be implemented by subclass";
  }

  get obj() {
    return {
      schema: this.schema,
      key: this.key,
      value: this.value,
      type: this.type,
      kind: this.kind,
      config: this.config
    };
  }
}
