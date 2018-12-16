import { MixedSchemaEntry } from "../mixed";
import { createObjectGuard } from "./guard";
import { ObjectDef } from "../../../../_types";

const proceed = (obj, config = {}) => {
  return createObjectGuard(obj, config).verify();
};

export function toYupObjectSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

export function buildSchemaEntry(obj) {
  return ObjectSchemaEntry.schemaEntryFor(obj);
}

export function createSchemaEntry(obj) {
  return ObjectSchemaEntry.create(obj);
}

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
      const schema = buildYup(this.value);
      // this.base.shape(schema);
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
