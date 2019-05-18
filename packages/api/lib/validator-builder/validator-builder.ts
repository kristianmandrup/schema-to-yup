import yup from "yup";
import { Loggable } from "@schema-validator/core";
import { createSchemaEntry } from "../create-entry";
import { isObjectType } from "./is-object";

export function buildValidator(schema, config = {}) {
  return new ValidatorBuilder(schema, config).instance;
}

export class ValidatorBuilder extends Loggable {
  schema: any;
  type: any;
  properties: any;
  required: any;
  shapeConfig: any;
  validSchema: boolean = false;

  constructor(schema, config = {}) {
    super(config);
    this.schema = schema;
    const type = this.getType(schema);
    const properties = this.getProps(schema);
    this.type = type;
    this.properties = properties;
    this.required = this.getRequired(schema);
    if (isObject(type)) {
      if (isObjectType(properties)) {
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

  // TODO: return .instance of Validator built
  get instance() {
    return {};
    //
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

  normalizeRequired(schema?: any) {
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

  propsToShape({ properties, name, config }) {
    properties = properties || {
      ...this.properties
    };
    const keys = Object.keys(properties);
    return keys.reduce((acc, key) => {
      // this.logInfo("propsToShape", {
      //   key
      // });
      const value = properties[key];
      const yupSchemaEntry = this.propToValidatorSchemaEntry({
        name,
        key,
        value
      });
      this.logInfo("propsToShape", { key, yupSchemaEntry });
      acc[key] = yupSchemaEntry;
      return acc;
    }, {});
  }

  propToValidatorSchemaEntry({ name, key, value = {} }) {
    const entryBuilder =
      this.createSchemaEntry || this.config.createYupSchemaEntry;
    return entryBuilder({ name, key, value, config: this.config });
  }

  createSchemaEntry(opts: any = {}) {
    return createSchemaEntry(opts);
  }
}
