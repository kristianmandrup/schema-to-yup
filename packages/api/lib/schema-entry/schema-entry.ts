// import * as validators from "./validators";
import { Loggable } from "@schema-validator/core";

export type ObjectDef = {
  [key: string]: any;
};

export class SchemaEntryError extends Error {}

export class SchemaEntry extends Loggable {
  key: string;
  name: string;
  type: string;
  types: ObjectDef;
  value: ObjectDef;
  config: ObjectDef;
  validatorName: string;

  constructor({ name, key, value, config }) {
    super(config);
    this.key = key;
    this.value = value;
    this.config = config;
    this.name = name;
    this.type = value.type;

    const validatorName = config.validatorName || "yup";
    this.validatorName = validatorName;

    const types = config.types || {};
    this.types = types[validatorName] || {};
  }

  isValidSchema() {
    return typeof this.type === "string";
  }

  error(msg) {
    throw new SchemaEntryError(msg);
  }

  // TODO: needs rewrite. See json-schema-to-mapping-es library
  toEntry() {
    if (!this.isValidSchema()) this.error("Not a valid schema");
    const config = this.obj;
    // try to find a type specific Yup schema entry

    // TODO: make generic
    // use typeOrder, see json-schema-to-mapping-es library
  }

  get obj() {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }
}
