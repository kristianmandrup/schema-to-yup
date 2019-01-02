import * as yup from 'yup';
import { Base, YupSchemaEntry, YupSchemaEntryError } from './entry';
import { extendYupApi } from './validator-bridge';

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
    const type = this.getType(schema);
    const props = this.getProps(schema);
    this.type = type;
    this.properties = props;
    this.required = this.getRequired(schema);
    if (isObject(type)) {
      if (isObjectType(props)) {
        const name = this.getName(schema);
        const properties = this.normalizeRequired(schema);
        const shapeConfig = this.propsToShape({ properties, name, config });
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

  getRequired(obj) {
    const { getRequired } = this.config;
    return getRequired ? getRequired(obj) : obj.required || [];
  }

  getProps(obj) {
    return this.config.getProps(obj);
  }

  getType(obj) {
    return this.config.getType(obj);
  }

  getName(obj) {
    return this.config.getName(obj);
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
      value.required = this.isRequired(value) || isRequired;
      acc[key] = value;
      return acc;
    }, {});
  }

  isRequired(value) {
    return this.config.isRequired(value);
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
    // return createYupSchemaEntry({ name, key, value, config });
    return new YupSchemaEntry({
      name,
      key,
      value,
      config
    }).toEntry();
  }
}

import * as types from './types';
import { createYupSchemaEntry } from './create-entry';

export {
  buildYup,
  YupBuilder,
  YupSchemaEntry,
  YupSchemaEntryError,
  types,
  createYupSchemaEntry,
  extendYupApi
};
