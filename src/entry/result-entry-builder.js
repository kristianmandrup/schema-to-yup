import { Base } from "../base";
import defaults from "./defaults";

export class ResultEntryBuilder extends Base {
  constructor({ schema, name, key, value, config, adapterName }) {
    super(config);
    this.schema = schema;
    this.key = key;
    this.value = value;
    this.config = config;
    this.name = name;
    this.type = value.type;
    this.adapterName = adapterName;
    this.adapter = defaults.adapters[adapterName] || {};
    this.typeBuilderMap =
      config.typeBuilderMap || this.adapter.types || this.typeBuilderMap;
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
    for (let type of this.typeOrderMap) {
      const result = this.buildForType(type);
      if (result) return result;
    }
    return this.defaultType();
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

  get typeOrderMap() {
    return ["string", "number", "boolean", "array", "object", "date"];
  }

  buildForType(type, obj) {
    (obj = obj || this.obj), this.config;
    this.typeBuilderMap[type](obj);
  }

  defaultType(config) {
    // return this.mixed(config)
    this.error("toEntry: unknown type", config);
  }
}
