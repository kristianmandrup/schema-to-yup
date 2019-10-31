import * as yup from "yup";
import { Base } from "../entry/entry";

function isObject(type) {
  return type && type === "object";
}

function isObjectType(obj) {
  return obj === Object(obj);
}

export class BaseInstanceBuilder extends Base {
  constructor(schema, config = {}) {
    super(config);
    this.init(schema, config);
  }

  init(schema, config) {
    config.buildInstance = config.buildInstance || buildInstance;

    config.createFromSchemaEntry =
      config.createFromSchemaEntry || createFromSchemaEntry;

    this.config = Object.assign(this.config, config);

    this.schema = schema;
    const type = this.getType(schema);
    const properties = this.getProperties(schema);
    this.type = type;
    this.properties = properties;

    this.required = this.getRequired(schema);

    const name = this.getName(schema);
    const properties = this.normalizeRequired(schema);
    const shapeConfig = this.propsToShape({ properties, name, config });

    this.shapeConfig = shapeConfig;
    this.validSchema = true;
  }

  getRequired(obj) {
    const { getRequired } = this.config;
    return getRequired ? getRequired(obj) : obj.required || [];
  }

  getProperties(obj) {
    return this.config.getProperties(obj);
  }

  getType(obj) {
    return this.config.getType(obj);
  }

  getName(obj) {
    return this.config.getName(obj);
  }

  get toInstance() {
    return this.form.shape(this.shapeConfig);
  }

  get form() {
    throw "Not implemented";
  }

  propToEntry({ name, key, value = {} }) {
    const instanceBuilder =
      this.createFromSchemaEntry || this.config.createFromSchemaEntry;

    return instanceBuilder({
      schema: this.schema,
      name,
      key,
      value,
      config: this.config
    });
  }

  createFromSchemaEntry({ schema, name, key, value, config }) {
    const instance = config.createFromSchemaEntry({
      schema,
      name,
      key,
      value,
      config
    });
    return instance;
  }
}
