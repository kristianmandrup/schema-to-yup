import { YupMixed } from "../mixed";

// Allow recursive schema
export class YupObject extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.baseType;
    this.base = this.validatorInstance;
    this.properties = this.value.properties;
  }

  get baseType() {
    return "object";
  }

  get validatorInstance() {
    return this.validator.object();
  }

  static create(obj) {
    return new YupObject(obj);
  }

  get typeEnabled() {
    return ["noUnknown", "camelCase", "constantCase"];
  }

  convert() {
    if (!this.properties) return this;
    super.convert();
    // this.initHelpers();
    // this.convertEnabled();

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
        this.validationErrorMessage("propertyNames") || this.validationErrorMessage("noUnknown")
      );
    this.base = newBase || this.base;
    return this;
  }
}
