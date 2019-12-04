import * as yup from "yup";
import uniq from "uniq";

class ConvertYupSchemaError extends Error {}

function isObjectType(obj) {
  return obj === Object(obj);
}

import { Base } from "../base";
import { createWhenCondition } from "../../conditions";
import { ConstraintBuilder } from "../../constraint-builder";
import { ErrorMessageHandler } from "../../error-message-handler";

class YupMixed extends Base {
  constructor(opts = {}) {
    super(opts.config);
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

  get mode() {
    return this.config.mode || {};
  }

  get disableFlags() {
    return [false, "disabled", "no", "off"];
  }

  get enableFlags() {
    return [true, "enabled", "yes", "on"];
  }

  disabledMode(modeName) {
    const modeEntry = this.mode[modeName];
    return !!this.disableFlags.find(disable => modeEntry === disable);
  }

  enabledMode(modeName) {
    const modeEntry = this.mode[modeName];
    return !!this.enableFlags.find(disable => modeEntry === disable);
  }

  get shouldPreProcessValue() {
    return !this.disabledMode("notRequired");
  }

  preProcessedConstraintValue(value) {
    if (!this.shouldPreProcessValue) return value;

    if (!this.isRequired(value)) {
      return {
        ...value,
        notRequired: true
      };
    }
    return value;
  }

  set value(value) {
    this._value = this.preProcessedConstraintValue(value);
  }

  get value() {
    return this._value;
  }

  initHelpers() {
    const { config } = this;
    const errorMessageHandlerFactoryFn =
      this.config.createErrorMessageHandler || this.createErrorMessageHandler;

    this.errorMessageHandler = errorMessageHandlerFactoryFn(this, config);

    const constraintBuilderFactoryFn =
      this.config.createConstraintBuilder || this.createConstraintBuilder;
    this.constraintBuilder = constraintBuilderFactoryFn(this, config);

    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
  }

  createConstraintBuilder(typeHandler, config = {}) {
    return new ConstraintBuilder(typeHandler, config);
  }

  createErrorMessageHandler(typeHandler, config = {}) {
    return new ErrorMessageHandler(typeHandler, config);
  }

  rebind(...methods) {
    methods.map(name => {
      const method = this[name];
      this[name] = this.isFunctionType(method) ? method.bind(this) : method;
    });
  }

  validateOnCreate(key, value, opts) {
    if (!key) {
      this.error(`create: missing key ${JSON.stringify(opts)}`);
    }
    if (!value) {
      this.error(`create: missing value ${JSON.stringify(opts)}`);
    }
  }

  // override for each type

  get mixedEnabled() {
    return (
      this.mixedConfig.enabled || [
        "oneOf",
        "notOneOf",
        "when",
        "nullable",
        "isType"
      ]
    );
  }

  // override for each type
  get typeEnabled() {
    return [];
  }

  get $typeExtends() {
    if (!Array.isArray(this.typeConfig.extends)) return;
    return uniq([...this.typeConfig.extends, ...this.typeEnabled]);
  }

  get configuredTypeEnabled() {
    return Array.isArray(this.typeConfig.enabled)
      ? this.typeConfig.enabled
      : this.typeEnabled;
  }

  get $typeEnabled() {
    return this.$typeExtends || this.configuredTypeEnabled;
  }

  get enabled() {
    return [...this.mixedEnabled, ...this.$typeEnabled];
  }

  convertEnabled() {
    this.enabled.map(name => {
      const convertFn = this.convertFnFor(name);
      if (convertFn) {
        convertFn(this);
      }
    });
  }

  convertFnFor(name) {
    return this.customConvertFnFor(name) || this.builtInConvertFnFor(name);
  }

  customConvertFnFor(name) {
    const typeConvertMap = this.typeConfig.convert || {};
    return typeConvertMap[name];
  }

  builtInConvertFnFor(name) {
    return this[name].bind(this);
  }

  getConstraints() {
    return this.config.getConstraints(this.value);
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

  addValueConstraint(propName, opts) {
    return this.constraintBuilder.addConstraint(propName, opts);
  }

  addConstraint(propName, opts) {
    return this.constraintBuilder.addConstraint(propName, opts);
  }

  addMappedConstraints() {
    // contains different types of constraints (ie. name -> yup constraint function calls)
    const keys = Object.keys(this.constraintsMap);
    const fn = this.addMappedConstraint.bind(this);
    keys.map(fn);
    return this;
  }

  addMappedConstraint(key) {
    const { constraintsMap } = this;
    const constraintNames = constraintsMap[key];
    const fnName = key === "value" ? "addValueConstraint" : "addConstraint";
    const fn = this[fnName];
    constraintNames.map(constraintName => {
      fn(constraintName);
    });
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }

  oneOf() {
    let values =
      this.constraints.enum || this.constraints.oneOf || this.constraints.anyOf;
    if (this.isNothing(values)) return this;
    values = Array.isArray(values) ? values : [values];
    // using alias
    const alias = ["oneOf", "enum", "anyOf"].find(key => {
      return this.constraints[key];
    });
    // TODO: pass value as constraintValue not value

    return this.addConstraint(alias, { values });
  }

  notOneOf() {
    const { not, notOneOf } = this.constraints;
    let values = notOneOf || (not && (not.enum || not.oneOf));
    if (this.isNothing(values)) return this;
    values = Array.isArray(values) ? values : [values];
    // TODO: pass value as constraintValue not value
    return this.addConstraint("notOneOf", { values });
  }

  valErrMessage(msgName) {
    return this.errorMessageHandler.valErrMessage(msgName);
  }

  createWhenConditionFor(when) {
    const opts = {
      key: this.key,
      type: this.type,
      value: this.value,
      schema: this.schema,
      properties: this.properties,
      config: this.config,
      when
    };

    const $createWhenCondition =
      this.config.createWhenCondition || createWhenCondition;

    return $createWhenCondition(opts);
  }

  when() {
    const when = this.constraints.when;
    if (!isObjectType(when)) return this;
    const { constraint } = this.createWhenConditionFor(when);

    if (!constraint) {
      this.warn(`Invalid when constraint for: ${when}`);
      return this;
    } else {
      this.logInfo(`Adding when constraint for ${this.key}`, constraint);
      // use buildConstraint or addConstraint to add when constraint (to this.base)

      this.addConstraint("when", { values: constraint, errName: "when" });
    }
    return this;
  }

  isType() {
    const value = this.constraints.isType;
    this.addConstraint("isType", { value, errName: "notOneOf" });
    return this;
  }

  nullable() {
    const { nullable, isNullable } = this.constraints;
    const value = nullable || isNullable;
    this.addConstraint("nullable", { value, errName: "notOneOf" });
    return this;
  }

  message() {
    return config.messages[this.key] || config.messages[this.type] || {};
  }

  errMessage(errKey = "default") {
    return this.message[errKey] || "error";
  }

  toValidJSONSchema() {}

  normalize() {}

  deNormalize() {}

  errorMsg(msg) {
    this.throwError(msg);
  }

  error(name, msg) {
    const label = `[${name}]`;
    const fullMsg = [label, msg].join(" ");
    this.errorMsg(fullMsg);
  }

  // throw ConvertYupSchemaError(fullMsg);
  throwError(msg) {
    throw msg;
  }
}

export { YupMixed, ConvertYupSchemaError };
