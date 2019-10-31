import { Base } from "../base";
import defaults from "./defaults";

export class ResultEntryBuilder extends Base {
  constructor({ schema, name, key, value, config }) {
    super(config);
    this.schema = schema;
    this.key = key;
    this.value = value;
    this.config = config;
    this.name = name;
    this.type = value.type;
    this.typeBuilderMap = config.typeBuilderMap || this.typeBuilderMap;
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

  get typeBuilderMap() {
    return {
      string: toYupString,
      number: toYupNumberSchemaEntry,
      boolean: toYupBoolean,
      array: toYupArray,
      object: toYupObject,
      date: toYupDate
    };
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
