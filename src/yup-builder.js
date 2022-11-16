import * as yup from "yup";
import { Base } from "./entry";
import { createYupSchemaEntry } from "./create-entry";

function isObject(type) {
  return type && type === "object";
}

export function buildYup(schema, config = {}, parentNode = undefined) {
  return new YupBuilder(schema, { ...config }, parentNode).yupSchema;
}

function isObjectType(obj) {
  return obj === Object(obj);
}

export class YupBuilder extends Base {
  constructor(schema, config = {}, parentNode = undefined) {
    super(config);
    this.init(schema, config, parentNode);
  }

  init(schema, config, parentNode = undefined) {
    config.buildYup = buildYup;
    config.createYupSchemaEntry =
      config.createYupSchemaEntry || createYupSchemaEntry;
    this.config = Object.assign(this.config, config);
    this.schema = schema;
    const type = this.getType(schema);
    const props = this.getProps(schema);
    this.parentNode = parentNode;
    this.type = type;
    this.properties = {
      ...props,
    };
    this.additionalProps = this.getAdditionalProperties(schema);
    this.required = this.getRequired(schema);

    this.setLocale();

    const customInitFn =
      typeof config.init === "function" ? config.init : () => {};
    const customInit = customInitFn.bind(this);
    customInit(schema, config);

    if (!isObject(type)) {
      this.error(`invalid schema: must be type: "object", was type: ${type}`);
      return;
    }

    if (!isObjectType(props)) {
      const props = JSON.stringify(properties);
      this.error(`invalid schema: must have a properties object: ${props}`);
      return;
    }

    const name = this.getName(schema);
    const buildProperties = (
      config.buildProperties || this.buildProperties
    ).bind(this);
    const properties = buildProperties(schema, this);

    const shapeConfig = this.propsToShape({ properties, name, config });
    this.shapeConfig = shapeConfig;
    this.validSchema = true;
  }

  get validator() {
    return yup;
  }

  setLocale() {
    this.config.locale && yup.setLocale(this.config.locale);
  }

  getAdditionalProperties(schema) {
    return schema.additionalProperties;
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

  buildProperties() {
    const propKeys = Object.keys(this.properties);
    const buildProp = (this.config.buildProp || this.buildProp).bind(this);
    return propKeys.reduce(buildProp, {});
  }

  getRequiredPropsList() {
    return Array.isArray(this.required) ? [...this.required] : [];
  }

  buildProp(propObj, key) {
    const value = this.properties[key];
    const required = this.getRequiredPropsList();
    const setRequired = (this.config.setRequired || this.setRequired).bind(
      this
    );
    // normalize required for prop
    setRequired(value, key, required);
    // set schema property entry
    const setPropEntry = (this.config.setPropEntry || this.setPropEntry).bind(
      this
    );
    setPropEntry(propObj, key, value);
    return propObj;
  }

  // normalize required for prop
  setRequired(value, key, required) {
    const isRequired = required.indexOf(key) >= 0;
    if (!isObjectType(value)) {
      this.warn(`Bad property value: ${value} must be an object`);
    }
    value.required = this.isRequired(value) || isRequired;
    return value;
  }

  setPropEntry(propObj, key, value) {
    // order so required errors will be first
    propObj[key] = {
      required: value.required,
      ...value,
    };
  }

  isRequired(value) {
    return this.config.isRequired(value);
  }

  propsToShape(opts = {}) {
    const shape = this.objPropsToShape(opts);
    this.objPropsShape = shape;
    this.addPropsShape = this.additionalPropsToShape(shape, opts);
    return shape;
  }

  additionalPropsToShape(shape, opts = {}) {
    return shape;
  }

  objPropsToShape({ name } = {}) {
    const properties = {
      ...this.properties,
    };
    const keys = Object.keys(properties);
    const _reducePropToShape = this.reducePropToShape.bind(this);
    return keys.reduce((acc, key) => {
      const value = properties[key];
      const prop = {
        name,
        key,
        value,
      };
      return _reducePropToShape(acc, key, prop);
    }, {});
  }

  reducePropToShape(acc, key, prop) {
    const yupSchemaEntry = this.propToYupSchemaEntry(prop);
    this.logInfo("propToShape", { ...prop, yupSchemaEntry });
    if (yupSchemaEntry) {
      acc[key] = yupSchemaEntry;
    }
    return acc;
  }

  propToYupSchemaEntry({ name, key, value = {} }) {
    const schemaEntryObj = {
      schema: this.schema,
      parentNode: this.parentNode || this,
      name,
      key,
      value,
      config: this.config,
      builder: this,
    };
    return this.createYupSchemaEntry(schemaEntryObj);
  }

  createYupSchemaEntry(opts = {}) {
    return this.config.createYupSchemaEntry(opts);
  }

  onConstraintAdded(constraint) {
    this.logInfo("Constraint Added", constraint);
  }
}
