import * as yup from "yup";

class ConvertYupSchemaError extends Error {}

import { YupBaseType } from "../base-type";

class YupMixed extends YupBaseType {
  constructor(opts = {}) {
    super(opts.config);
    this.init()
  }

  init() {
    const { opts } = this
    let { schema, key, value, config } = opts;
    config = config || {};
    schema = schema || {};
    this.validateOnCreate(key, value, opts);
    this.yup = yup;
    this.key = key;
    this.schema = schema;
    this.properties = schema.properties || {};
    this.value = value;
    this.constraints = this.getConstraints();
    this.format = value.format || this.constraints.format;
    this.config = config || {};
    this.type = "mixed";
    this.mixedConfig = this.config.mixed || {};
    this.typeConfig = this.config[this.type] || {};
    this.base = yup.mixed();
    this.errMessages = config.errMessages || {};
    this.configureTypeConfig();
    this.constraintsAdded = {};
  }

  configureTypeConfig() {
    if (this.typeConfig.enabled || this.typeConfig.extends) return;
    if (!this.typeConfig.convert) return;
    this.typeConfig.extends = Object.keys(this.typeConfig.convert);
  }

  isRequired(value) {
    value = value || this.value;
    return value.required === true;
  }

  initHelpers() {
    const { config } = this;
    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
  }

  rebind(...methods) {
    methods.map(name => {
      const method = this[name];
      this[name] = this.isFunctionType(method) ? method.bind(this) : method;
    });
  }

  // override for each type

  get mixedEnabled() {
    return (
      this.mixedConfig.enabled || [
        "label",
        "oneOf",
        "notOneOf",
        "when",
        "nullable",
        "isType",        
      ]
    );
  }

  createSchemaEntry() {
    return this.convert().base;
  }

  convert() {
    this.initHelpers();
    this.addMappedConstraints();
    this.convertEnabled();
    return this;
  }
}

export { YupMixed, ConvertYupSchemaError };
