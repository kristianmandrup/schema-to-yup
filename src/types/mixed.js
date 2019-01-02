import * as yup from 'yup';

class ConvertYupSchemaError extends Error {}

const errValKeys = [
  "oneOf",
  "enum",
  "required",
  "notRequired",
  "minDate",
  "min",
  "maxDate",
  "max",
  "trim",
  "lowercase",
  "uppercase",
  "email",
  "url",
  "minLength",
  "maxLength",
  "pattern",
  "matches",
  "regex",
  "integer",
  "positive",
  "minimum",
  "maximum"
];

const defaults = {
  errMessages: (keys = errValKeys) =>
    keys.reduce((acc, key) => {
      const fn = ({ key, value }) =>
        `${key}: invalid for ${value.name || value.title}`;
      acc[key] = fn;
      return acc;
    }, {})
};

import { Base } from './base';

class YupMixed extends Base {
  constructor({ key, value, config } = {}) {
    super(config);
    this.validateOnCreate(key, value);
    this.yup = yup;
    this.key = key;
    this.value = value;
    this.constraints = this.getConstraints();
    this.format = value.format || this.constraints.format;
    this.config = config || {};
    this.type = "mixed";
    this.base = yup.mixed();
    this.errMessages = config.errMessages || {};
    this.constraintsAdded = {};

    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
  }

  rebind(...methods) {
    methods.map(name => {
      const method = this[name];
      this[name] = this.isFunctionType(method) ? method.bind(this) : method;
    });
  }

  validateOnCreate(key, value) {
    if (!key) {
      this.error("create: missing key");
    }
    if (!value) {
      this.error("create: missing value");
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
    return this;
  }

  addValueConstraint(propName, { constraintName, errName } = {}) {
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  addConstraint(propName, { constraintName, method, value, errName } = {}) {
    const propValue = this.constraints[propName];
    if (propValue) {
      constraintName = constraintName || propName;
      method = method || constraintName;
      if (!this.base[method]) {
        this.warn(`Yup has no such API method: ${method}`);
        return this;
      }
      const constraintFn = this.base[method].bind(this.base);
      const errFn =
        this.valErrMessage(constraintName) ||
        (errName && this.valErrMessage(errName));
      const constraintValue = value === true ? propValue : value;
      this.onConstraintAdded({ name: constraintName, value: constraintValue });

      const newBase = constraintValue
        ? constraintFn(constraintValue, errFn)
        : constraintFn(errFn);
      this.base = newBase || this.base;
    }
    return this;
  }

  onConstraintAdded({ name, value }) {
    this.constraintsAdded[name] = value;
    return this;
  }

  addMappedConstraints() {
    const $map = this.constraintsMap;
    const keys = Object.keys($map);
    keys.map(key => {
      const list = $map[key];
      const fnName = key === "value" ? "addValueConstraint" : "addConstraint";
      list.map(this[fnName]);
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
    const value = this.constraints.enum || this.constraints.oneOf;
    return this.addConstraint("oneOf", { value, errName: "enum" });
  }

  notOneOf() {
    const { not, notOneOf } = this.constraints;
    const value = notOneOf || (not && (not.enum || not.oneOf));
    return this.addConstraint("notOneOf", { value });
  }

  valErrMessage(constraint) {
    const errMsg = this.errMessages[this.key]
      ? this.errMessages[this.key][constraint]
      : undefined;
    return typeof errMsg === "function" ? errMsg(this.constraints) : errMsg;
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

  // conditions https://ajv.js.org/keywords.html#not
  $not() {
    return this;
  }

  $if() {
    return this;
  }

  $then() {
    return this;
  }

  $else() {
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
    //console.error(msg);
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

export {
  defaults,
  errValKeys,
  YupMixed,
  ConvertYupSchemaError
};
