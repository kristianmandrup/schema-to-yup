const yup = require("yup");

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

const { Base } = require("./base");

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
  }

  validateOnCreate(key, value) {
    if (!key) {
      this.error("create: missing key");
    }
    if (!value) {
      this.error("create: missing value");
    }
  }

  getConstraints() {
    return this.config.getConstraints(this.value);
  }

  yupped() {
    return this.convert().base;
  }

  convert() {
    this.nullable()
      .required()
      .notRequired()
      .oneOf()
      .notOneOf()
      .ensureDefault()
      .strict();
    return this;
  }

  addValueConstraint(propName, { constraintName, errName } = {}) {
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  addConstraint(propName, { constraintName, value, errName } = {}) {
    const propValue = this.constraints[propName];
    if (propValue) {
      constraintName = constraintName || propName;
      const constraintFn = this.base[constraintName].bind(this.base);
      const errFn =
        this.valErrMessage(constraintName) ||
        (errName && this.valErrMessage(errName));
      const constraintValue = value === true ? propValue : value;
      const newBase = constraintValue
        ? constraintFn(constraintValue, errFn)
        : constraintFn(errFn);
      this.base = newBase || this.base;
    }
    return this;
  }

  ensureDefault() {
    return this.addValueConstraint("default");
  }

  strict() {
    return this.addValueConstraint("strict");
  }

  required() {
    return this.addConstraint("required");
  }

  notRequired() {
    return this.addConstraint("notRequired");
  }

  nullable() {
    return this.addConstraint("nullable");
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
    console.error(msg);
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

module.exports = {
  defaults,
  errValKeys,
  YupMixed,
  ConvertYupSchemaError
};
