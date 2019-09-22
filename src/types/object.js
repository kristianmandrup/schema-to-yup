import { YupMixed } from "./mixed";
// import { buildYup } from "../";

const isObject = fieldDef => fieldDef && fieldDef.type === "object";

export class ObjectHandler {
  constructor(config = {}) {
    config = config || {};
    config.isObject = config.isObject || isObject;
    this.config = config;
    this.schema = config.schema;
  }

  isObject(obj) {
    return this.config.isObject(obj.value);
  }

  handle(obj) {
    return (
      this.isObject(obj) &&
      YupObject.create({ ...obj, config: this.config }).createSchemaEntry()
    );
  }
}

export function createObjectHandler(config = {}) {
  return new ObjectHandler(config);
}

export function toYupObject(obj, config = {}) {
  return obj && new ObjectHandler(config).handle(obj);
}

// Allow recursive schema
export class YupObject extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "object";
    this.base = this.yup.object();
    this.properties = this.value.properties;
  }

  static create(obj) {
    return new YupObject(obj);
  }

  convert() {
    if (!this.properties) return this;
    this.noUnknown();
    this.camelCase().constantCase();

    const schema = this.value;
    const config = this.config;

    // recursive definition
    if (schema) {
      if (!config.buildYup) {
        this.error("convert", "Missing buildYup function from config", config);
      }

      const yupSchema = this.config.buildYup(schema, config);
      this.base = yupSchema;
    }
    return this;
  }

  camelCase() {
    return this.addConstraint("camelCase");
  }

  constantCase() {
    return this.addConstraint("constantCase");
  }

  noUnknown() {
    const { noUnknown, propertyNames } = this.value;
    const $names = noUnknown || propertyNames;
    const newBase =
      $names &&
      this.base.noUnknown(
        $names,
        this.valErrMessage("propertyNames") || this.valErrMessage("noUnknown")
      );
    this.base = newBase || this.base;
    return this;
  }
}
