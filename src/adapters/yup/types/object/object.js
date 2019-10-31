import { BaseType } from "../base";

// Allow recursive schema
export class ObjectType extends BaseType {
  constructor(obj) {
    super(obj);
    this.type = "object";
    this.properties = this.value.properties;
  }

  static create(obj, config) {
    return new ObjectType(obj, config);
  }

  convert() {
    if (!this.properties) return this;
    this.noUnknown();
    this.camelCase().this.constantCase();

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
