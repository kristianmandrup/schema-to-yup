import yup from "yup";
import { Base, SchemaEntry } from "./entry";
export { yup };

export function isObject(type) {
  return type && type === "object";
}

export function isObjectType(obj) {
  return obj === Object(obj);
}

export class Builder extends Base {
  config: any;
  schema: any;
  type: string;
  properties: any;
  required: any;
  shapeConfig: any;
  validSchema: any;

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
        const shapeConfig = this.propsToShape({
          name
        });
        this.shapeConfig = shapeConfig;
        this.validSchema = true;
        return;
      } else {
        this.error(
          `invalid schema: must have a properties object: ${JSON.stringify(
            props
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

  get validatorSchema() {
    throw "validatorSchema getter must be defined by subclass";
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
      const schemaEntry = this.propToValidatorSchemaEntry({
        name,
        key,
        value
      });
      this.logInfo("propsToShape", { key, schemaEntry });
      acc[key] = schemaEntry;
      return acc;
    }, {});
  }

  propToValidatorSchemaEntry({ name, key, value = {} }) {
    const entryBuilder =
      this.createSchemaEntry || this.config.createSchemaEntry;
    return entryBuilder({ name, key, value, config: this.config });
  }

  createSchemaEntry({ name, key, value, config }) {
    // return createYupSchemaEntry({ name, key, value, config });
    return new SchemaEntry({
      name,
      key,
      value,
      config
    }).toEntry();
  }
}
