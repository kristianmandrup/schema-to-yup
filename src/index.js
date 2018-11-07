const yup = require("yup");
const { Base, YupSchemaEntry, YupSchemaEntryError } = require("./entry");

function isObject(type) {
  return type && type === "object";
}

function buildYup(schema, config = {}) {
  return new YupBuilder(schema, config).yupSchema;
}

function isObjectType(obj) {
  return obj === Object(obj);
}

class YupBuilder extends Base {
  constructor(schema, config = {}) {
    super(config);
    this.schema = schema;
    this.config = config;
    let { type, properties } = schema;
    const { log } = config;
    this.log = typeof log === "boolean" ? console.log : log;
    this.type = type;
    this.properties = properties;
    this.required = schema.required || [];
    if (isObject(type)) {
      if (isObjectType(properties)) {
        const name = schema.title || schema.name;
        properties = this.normalizeRequired(schema);
        const shapeConfig = this.propsToShape({ properties, name, config });
        log && log({ shapeConfig });
        this.shapeConfig = shapeConfig;
        this.validSchema = true;
        return;
      } else {
        this.error(
          `invalid schema: must have a properties object: ${JSON.stringify(
            properties
          )}`
        );
      }
    } else {
      this.error(`invalid schema: must be an object type, was: ${type}`);
    }
  }

  get yupSchema() {
    return yup.object().shape(this.shapeConfig);
  }

  normalizeRequired() {
    const properties = {
      ...this.properties
    };
    const required = [...this.required] || [];
    // this.logInfo("normalizeRequired", {
    //   properties,
    //   required
    // });
    const propKeys = Object.keys(properties);
    return propKeys.reduce((acc, key) => {
      // this.logInfo("normalizeRequired", {
      //   key
      // });
      const value = properties[key];
      const isRequired = required.indexOf(key) >= 0;
      value.required = value.required || isRequired;
      acc[key] = value;
      return acc;
    }, {});
  }

  propsToShape({ name }) {
    const properties = {
      ...this.properties
    };
    const keys = Object.keys(properties);
    return keys.reduce((acc, key) => {
      // this.logInfo("propsToShape", {
      //   key
      // });
      const value = properties[key];
      const yupSchemaEntry = this.propToYupSchemaEntry({
        name,
        key,
        value
      });
      this.logInfo("propsToShape", { key, yupSchemaEntry });
      acc[key] = yupSchemaEntry;
      return acc;
    }, {});
  }

  propToYupSchemaEntry({ name, key, value = {} }) {
    const entryBuilder =
      this.createYupSchemaEntry || this.config.createYupSchemaEntry;
    return entryBuilder({ name, key, value, config: this.config });
  }

  createYupSchemaEntry({ name, key, value, config }) {
    return new YupSchemaEntry({
      name,
      key,
      value,
      config
    }).toEntry();
  }
}

const types = require("./types");

module.exports = {
  buildYup,
  YupBuilder,
  YupSchemaEntry,
  YupSchemaEntryError,
  types
};
