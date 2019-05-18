import { MixedSchemaEntry } from "../mixed/mixed";
import { ObjectDef } from "@schema-validator/core";

class ObjectSchemaEntry extends MixedSchemaEntry {
  // TODO: Allow recursive schema
  // Note: all types inherit from mixed
  // See https://github.com/jquense/yup#mixed

  properties: ObjectDef = {};

  constructor(obj) {
    super(obj);
    this.type = "object";
    // this.validatorTypeApi = this.yup.object();
    this.properties = this.value.properties;
  }

  static create(obj) {
    return new ObjectSchemaEntry(obj);
  }

  static schemaEntryFor(obj) {
    return ObjectSchemaEntry.create(obj).createSchemaEntry();
  }

  convert() {
    if (!this.properties) return this;
    this.noUnknown();
    this.camelCase();
    this.constantCase();

    // recursive definition
    if (this.value) {
      const schema = this.buildYup(this.value);
      // this.base.shape(schema);
    }
    return this;
  }

  // TODO: add error handler
  buildYup(value: any) {
    this.config.buildYup(value);
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
    // const newBase =
    //   $names &&
    //   this.base.noUnknown(
    //     $names,
    //     this.valErrMessage("propertyNames") || this.valErrMessage("noUnknown")
    //   );
    // this.validatorTypeApi = newBase || this.base;
    return this;
  }
}
