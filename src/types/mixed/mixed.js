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
    this.init(opts);
  }

  init(opts) {
    let { schema, key, value, config, entryHandler, parentNode } = opts;
    config = config || {};
    schema = schema || {};
    this.parentNode = parentNode || entryHandler?.parentNode;
    this.validateOnCreate(key, value, opts);
    this.opts = opts;
    this.entryHandler = entryHandler;
    this.validator = this.getValidator();
    this.key = key;
    this.schema = schema;
    this.properties = schema.properties || {};
    this.value = value;
    this.title = value.title;
    this.description = value.description;
    this.constraints = this.getConstraints();
    this.format = value.format || this.constraints.format;
    this.config = config || {};
    this.type = this.baseType;
    this.mixedConfig = this.config.mixedEnabled || {};

    const typeConfig = this.config[this.type] || {};
    const mixedConfig = this.config.mixed || {};

    this.mixedConfig = mixedConfig;
    this.typeConfig = {
      ...mixedConfig,
      ...typeConfig,
    };
    this.errMessages = config.errMessages || {};
    this.configureTypeConfig();
    this.constraintsAdded = {};
    this.base = this.getBase();
  }

  get keyPath() {
    this._keyPath = this._keyPath || this.calcKeyPath();
    return this._keyPath;
  }

  calcKeyPath() {
    let ctx = this;
    let parentNode;
    let keys = [];
    while ((parentNode = ctx.parentNode)) {
      if (!parentNode) {
        break;
      }
      keys.push(parentNode.key);
      ctx = ctx.parentNode;
    }
    return keys.join(".");
  }

  get builder() {
    return this.entryHandler && this.entryHandler.builder;
  }

  getBase() {
    return this.customBaseValidator || this.validatorInstance;
  }

  get customBaseValidator() {
    return this.config.validatorFor && this.config.validatorFor(this.type);
  }

  getValidator() {
    return (
      this.opts.validator ||
      this.config.validator ||
      (this.builder && this.builder.validator) ||
      yup
    );
  }

  get baseType() {
    return "mixed";
  }

  get validatorInstance() {
    return this.validator.mixed();
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
    return !!this.disableFlags.find((disable) => modeEntry === disable);
  }

  modeIsSet(modeName) {
    return this.mode[modeName] !== undefined;
  }

  modeIsNotSet(modeName) {
    return this.mode[modeName] === undefined;
  }

  enabledMode(modeName) {
    const modeEntry = this.mode[modeName];
    return !!this.enableFlags.find((disable) => modeEntry === disable);
  }

  get shouldPreProcessValue() {
    const notRequired =
      this.enabledMode("notRequired") || this.modeIsNotSet("notRequired");
    return notRequired;
  }

  preProcessedConstraintValue(value) {
    if (!this.shouldPreProcessValue) return value;
    const isExplRequired = this.isRequired(value);
    if (!isExplRequired) {
      return {
        ...value,
        notRequired: true,
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
    this.rebind("addConstraint", "addTrueValueConstraint");
  }

  createConstraintBuilder(typeHandler, config = {}) {
    return new ConstraintBuilder(typeHandler, config);
  }

  createErrorMessageHandler(typeHandler, config = {}) {
    return new ErrorMessageHandler(typeHandler, config);
  }

  rebind(...methods) {
    methods.map((name) => {
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
        "isType",
        "label",
        "const",
        "refValueFor",
        "typeError",
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
    this.enabled.map((name) => {
      const convertFn = this.convertFnFor(name);
      if (convertFn) {
        convertFn(this);
      }
    });
  }

  convertFnFor(name) {
    return (
      this.customConvertFnFor(name, this) || this.builtInConvertFnFor(name)
    );
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
    this.preConvert();
    this.convert();
    this.postConvert();
    return this.base;
  }

  preConvert() {
    const { preConvert } = this.config;
    const $preConvert = preConvert && preConvert.bind(this);
    $preConvert && $preConvert(this);
  }

  postConvert() {
    const { postConvert } = this.config;
    const $postConvert = postConvert && postConvert.bind(this);
    $postConvert && $postConvert(this);
  }

  convert() {
    this.initHelpers();
    this.addMappedConstraints();
    this.convertEnabled();
    return this;
  }

  apply(fnName, ...fnArgs) {
    if (typeof fnName !== "string") {
      throw new TypeError(
        `[Mixed] apply must take a method name available on the validator instance as first argument`
      );
    }
    this.base =
      (fnArgs && fnArgs.length && this.base[fnName](...fnArgs)) || this.base;
    return this;
  }

  applyArr(fnName, arrValue) {
    if (typeof fnName !== "string") {
      throw new TypeError(
        `[Mixed] apply must take a method name available on the validator instance as first argument`
      );
    }
    this.base =
      (arrValue && arrValue.length && this.base[fnName](arrValue)) || this.base;
    return this;
  }

  addTrueValueConstraint(propName, opts) {
    const constraint = this.constraintBuilder.addTrueValueConstraint(
      propName,
      opts
    );
    if (constraint) {
      const { base } = constraint;
      this.base = base || constraint;
    }
    return this;
  }

  addConstraint(propName, opts) {
    if (!this.constraintBuilder) {
      throw new Error(
        `[YupMixed] addConstraint: Missing constraintBuilder in ${this.constructor.name}`
      );
    }
    const constraint = this.constraintBuilder.addConstraint(propName, opts);
    if (constraint) {
      this.base = constraint;
    }
    return this;
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
    const fnName =
      key === "trueValue" ? "addTrueValueConstraint" : "addConstraint";
    const fn = this[fnName];
    const value = this.constraints[key];
    constraintNames.map((constraintName) => {
      fn(constraintName, { value });
    });
  }

  get constraintsMap() {
    return {
      simple: ["default", "required", "notRequired", "nullable"],
      trueValue: ["strict"],
    };
  }

  typeError() {
    const configTypeError = this.validationErrorMessage("typeError");
    if (this.isNothing(configTypeError)) return this;
    this.logInfo("typeError", { configTypeError });
    return this.apply("typeError", configTypeError);
  }

  refValueFor() {
    let propRefName = this.constraints.refValueFor;
    if (this.isNothing(propRefName)) return this;
    this.logInfo("refValueFor", { propRefName });
    return this.apply(
      "when",
      (propRefName,
      (refValueFor, field) => {
        const errorText = this.errMessages[this.key].refValueFor;
        if (errorText) {
          return refValueFor
            ? field.required().oneOf([yup.ref(propRefName)], errorText)
            : field;
        }
        return refValueFor
          ? field.required().oneOf([yup.ref(propRefName)])
          : field;
      })
    );
  }

  normalizeValues(values) {
    return Array.isArray(values) ? values : [values];
  }

  get oneOfValues() {
    return (
      this.constraints.enum || this.constraints.oneOf || this.constraints.anyOf
    );
  }

  get oneOfAliases() {
    return ["oneOf", "enum", "anyOf"];
  }

  get oneOfAlias() {
    return this.oneOfAliases.find((key) => {
      return this.constraints[key] !== undefined;
    });
  }

  oneOf() {
    let values = this.oneOfValues;
    if (this.isNothing(values)) return this;
    values = this.normalizeValues(values);
    const resolvedValues = this.resolveValues(values);
    // using alias
    const alias = this.oneOfAlias;
    // log details
    const idObj = {
      constraintName: alias,
      method: "oneOf",
      key: this.key,
      type: this.type,
    };
    this.logDetails("type", idObj, values, resolvedValues);

    return this.addConstraint(alias, { values: resolvedValues });
  }

  oneOfConditional() {
    let { config, parentNode, isObject, value, key } = this;
    // optionally set custom errMsg
    const oneOfConstraints = value;
    this.base = this.base.test(
      key,
      // errMsg,
      (value, context) => {
        for (let constraint in oneOfConstraints) {
          if (!isObject(constraint)) {
            return value === constraint;
          }
          const yupSchema = config.buildYup(constraint, config, parentNode);
          const result = yupSchema.validate();
          if (result) return true;
        }
        return false;
      }
    );
  }

  notOneOfConditional() {
    let { config, parentNode, isObject, value, key } = this;
    // optionally set custom errMsg
    const oneOfConstraints = value;
    this.base = this.base.test(
      key,
      // errMsg,
      (value, context) => {
        for (let constraint in oneOfConstraints) {
          if (!isObject(constraint)) {
            return value !== constraint;
          }
          const yupSchema = config.buildYup(constraint, config, parentNode);
          const result = yupSchema.validate();
          if (result) return false;
        }
        return true;
      }
    );
  }

  logDetailed(label, idObj, ...values) {
    this.logDetails(label, idObj, ...values);
  }

  get notOneOfValues() {
    const { not, notOneOf } = this.constraints;
    return notOneOf || (not && (not.enum || not.oneOf));
  }

  notOneOf() {
    let values = this.oneOfValues;
    if (this.isNothing(values)) return this;
    values = this.normalizeValues(values);
    const resolvedValues = this.resolveValues(values);
    // log details
    const idObj = {
      constraintName: "notOneOf",
      method: "notOneOf",
      key: this.key,
      type: this.type,
    };
    this.logDetails("type", idObj, values, resolvedValues);

    return this.addConstraint("notOneOf", { values: resolvedValues });
  }

  resolveValues(values) {
    const schemaValues = values;
    return schemaValues.map((value) => {
      return this.isObjectType(value) ? this.resolveValue(value) : value;
    });
  }

  const() {
    let value = this.constraints.const;
    if (this.isNothing(value)) return this;
    // TODO: resolve const data ref if valid format
    if (this.isDataRef(value)) {
      const dataRefPath = this.normalizeDataRefPath(value);
      value = yup.ref(dataRefPath);
    }
    return this.addConstraint("oneOf", { values: [value] });
  }

  // TODO: investigate yup.ref
  normalizeDataRefPath(value) {
    value = value.$data || value;
    // remove first part before /
    const parts = value.split("/").shift();
    return parts.join("/");
  }

  isDataRef(value) {
    return this.isPresent(value.$data);
  }

  isConst(value) {
    return this.hasKey(value, "const");
  }

  resolveValue(value) {
    // special case for const
    if (this.isConst(value)) return value["const"];

    const createYupSchemaEntry = this.config.createYupSchemaEntry; // || this.entryHandler.createNew
    const opts = {
      schema: this.schema,
      key: this.key,
      value,
      config: this.config,
    };
    return createYupSchemaEntry(opts);
  }

  validationErrorMessage(msgName) {
    const defaultErrorMessageFn =
      this.errorMessageHandler.validationErrorMessage.bind(
        this.errorMessageHandler
      );
    const validationErrorMessageFn =
      this.config.validationErrorMessage || defaultErrorMessageFn;
    return validationErrorMessageFn(msgName, this);
  }

  createWhenConditionFor(when) {
    const opts = {
      key: this.key,
      type: this.type,
      value: this.value,
      schema: this.schema,
      properties: this.properties,
      config: this.config,
      when,
    };

    const $createWhenCondition =
      this.config.createWhenCondition || createWhenCondition;

    return $createWhenCondition(opts);
  }

  label() {
    const value = this.value;
    const label = value.title || value.label;
    this.base = (label && this.base.label(label)) || this.base;
    return this;
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
    this.addConstraint("isType", { value });
    return this;
  }

  nullable() {
    const nullable = this.value.nullable === true;
    this.base = (nullable && this.base.nullable()) || this.base;
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
