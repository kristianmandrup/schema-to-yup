import { Loggable } from "@schema-validator/core";
import { isObjectType, isObject } from "./is-object";
import { createSchemaValidator } from "@schema-validator/schema-resolver";
import { normalizeRequired } from "@schema-validator/schema-resolver";

export function buildWalker(schema, config = {}) {
  return new RootSchemaWalker(schema, config).instance;
}

export class RootSchemaWalker extends Loggable {
  config: any;
  schema: any;
  name: string = "unknown";
  type: any;
  properties: any;
  required: any;
  shapeConfig: any;
  validSchema: boolean = false;
  validator: any;
  createSchemaValidator: (config: any) => any;

  constructor(schema, config: any = {}) {
    super(config);
    this.schema = schema;
    this.type = this.getType(schema);
    this.properties = this.getProps(schema);
    this.createSchemaValidator =
      config.createSchemaValidator || createSchemaValidator;
  }

  init() {
    const {
      createSchemaValidator,
      validator,
      properties,
      schema,
      config
    } = this;
    this.validator = validator || createSchemaValidator(config);
    this.required = this.getRequired(schema);
    const valid = this.validator.validate(schema);
    if (!valid) {
      this.error(
        "init",
        `invalid schema: must have a properties object: ${JSON.stringify(
          properties
        )}`
      );
    }
    if (!isObjectType(this.properties)) {
      this.invalidProperties();
    }
    this.name = this.getName(this.schema);
    this.properties = this.normalizeRequired(schema);
    this.validSchema = true;
    return this;
  }

  invalidProperties() {}

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
    this.properties = normalizeRequired(schema);
  }

  isRequired(value) {
    return this.config.isRequired(value);
  }
}
