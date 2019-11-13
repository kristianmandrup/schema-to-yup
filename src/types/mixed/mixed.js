import * as yup from "yup";

class ConvertYupSchemaError extends Error {}

function isObjectType(obj) {
  return obj === Object(obj);
}

import { Base } from "../base";
import { createWhenCondition } from "../../conditions";
import { ConstraintBuilder } from "../constraint_builder";

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
    this.base = yup.mixed();
    this.errMessages = config.errMessages || {};
    this.constraintsAdded = {};
    const constraintBuilderFactoryFn =
      this.config.createConstraintBuilder || this.createConstraintBuilder;
    this.constraintBuilder = constraintBuilderFactoryFn(this, opts);

    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
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

  createConstraintBuilder(opts = {}) {
    return new ConstraintBuilder(opts);
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
  get enabled() {
    [];
  }

  convertEnabled() {
    this.enabled.map(name => {
      if (this[name]) {
        this[name]();
      }
    });
  }

  getConstraints() {
    return this.config.getConstraints(this.value);
  }

  createSchemaEntry() {
    return this.convert().base;
  }

  convert() {
    this.addMappedConstraints();
    this.oneOf().notOneOf();
    this.when();
    this.nullable().isType();
    return this;
  }

  addValueConstraint(propName, { constraintName, errName } = {}) {
    return this.constraintBuilder.addConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  get aliasMap() {
    return {
      oneOf: "oneOf",
      enum: "oneOf",
      anyOf: "oneOf"
      // ...
    };
  }

  buildConstraint(propName, opts = {}) {
    let {
      constraintName,
      constraintValue,
      propValue,
      method,
      yup,
      values,
      errName
    } = opts;
    yup = yup || this.base;
    constraintValue =
      constraintValue || propValue || this.constraints[propName];

    if (this.isNothing(constraintValue)) {
      // this.log("no prop value", {
      //   constraints: this.constraints,
      //   propName,
      //   constraintValue
      // });
      this.warn("no prop value");
      return yup;
    }
    constraintName = constraintName || propName;
    method = method || constraintName;

    const yupConstraintMethodName = this.aliasMap[method] || method;

    if (!yup[yupConstraintMethodName]) {
      this.warn(`Yup has no such API method: ${yupConstraintMethodName}`);
      return this;
    }

    const constraintFn = yup[yupConstraintMethodName].bind(yup);
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));

    const constrOpts = {
      constraintName,
      yup,
      constraintFn,
      errFn
    };

    const newBase =
      this.multiValueConstraint(values, constrOpts) ||
      this.presentConstraintValue(constraintValue, constrOpts) ||
      this.nonPresentConstraintValue(constraintValue, constrOpts);

    if (newBase) return newBase;

    this.warn("buildConstraint: missing value or values options");
    return yup;
  }

  nonPresentConstraintValue(
    constraintValue,
    { constraintName, constraintFn },
    errFn
  ) {
    if (this.isPresent(constraintValue)) return;
    // this.log("constraint - value not present, pass no value", {
    //   constraintValue
    // });

    // call yup constraint function with single value arguments (default)
    // constraintValue = value === true ? constraintValue : value;

    this.onConstraintAdded({ name: constraintName });

    const newBase = constraintFn(errFn);
    return newBase;
  }

  presentConstraintValue(
    constraintValue,
    { constraintName, constraintFn, errFn }
  ) {
    if (!this.isPresent(constraintValue)) return;

    this.onConstraintAdded({ name: constraintName, value: constraintValue });

    if (this.isNoValueConstraint(constraintName)) {
      let specialNewBase = constraintFn(errFn);
      return specialNewBase;
    }

    const newBase = this.isPresent(constraintValue)
      ? constraintFn(constraintValue, errFn)
      : constraintFn(errFn);
    return newBase;
  }

  multiValueConstraint(values, { constraintFn, constraintName, yup, errFn }) {
    if (!this.isPresent(values)) return;

    // call yup constraint function with multiple arguments
    if (!Array.isArray(values)) {
      this.warn("buildConstraint: values option must be an array of arguments");
      return yup;
    }

    this.onConstraintAdded({ name: constraintName, value: values });

    const newBase = constraintFn(...values, errFn);
    return newBase;
  }

  isNoValueConstraint(constraintName) {
    return this.noValueConstraints.includes(constraintName);
  }

  get noValueConstraints() {
    return ["required", "email", "url"];
  }

  addConstraint(propName, opts) {
    const contraint = this.buildConstraint(propName, opts);
    this.base = contraint || this.base;
    return this;
  }

  onConstraintAdded({ name, value }) {
    this.constraintsAdded[name] = value;
    return this;
  }

  addMappedConstraints() {
    // contains different types of constraints (ie. name -> yup constraint function calls)
    const $map = this.constraintsMap;
    const keys = Object.keys($map);
    keys.map(key => {
      const constraintNames = $map[key];
      const fnName = key === "value" ? "addValueConstraint" : "addConstraint";
      const fn = this[fnName];
      constraintNames.map(constraintName => {
        fn(constraintName);
      });
    });
    return this;
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

  valErrMessage(constraint) {
    const { constraints } = this;
    const errMsg = this.errMessageFor(constraint);
    return typeof errMsg === "function" ? errMsg(constraints) : errMsg;
  }

  errMessageFor(constraint) {
    const { errMessages, key } = this;
    const errMsg = errMessages[key];
    if (!errMsg) return;
    return errMsg[constraint] || errMsg;
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

  $const() {
    return this;
  }

  // boolean https: //ajv.js.org/keywords.html#allof
  $allOf() {
    return this;
  }

  // https://ajv.js.org/keywords.html#anyof
  $anyOf() {
    return this;
  }

  // https: //ajv.js.org/keywords.html#oneof
  $oneOf() {
    return this;
  }

  $if() {
    const $if = this.constraints.if;
    // TODO: translate to when?
    return this;
  }

  $then() {
    const $then = this.constraints.then;
    // TODO: use with if translated to when?
    return this;
  }

  $else() {
    const $else = this.constraints.else;
    // TODO: use with if translated to when?
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
