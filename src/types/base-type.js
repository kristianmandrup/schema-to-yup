const yup = require("yup");
const { Base } = require("./base");
const merge = require("deepmerge");
// class ConvertYupSchemaError extends Error {}

class YupBaseType extends Base {
  constructor({ key, value, config } = {}) {
    super(config);
    this.validateOnCreate(key, value);
    this.yup = yup;
    this.key = key;
    this.value = value;
    this.constraints = this.getConstraints();
    this.format = value.format || this.constraints.format;
    this.config = config || {};
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

  convert() {}

  addValueConstraint(propName, { constraintName, errName } = {}) {
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  groupedConstraint(name) {
    return (this.grouped || {})[name];
  }

  addConstraint(propName, opts = {}) {
    const names = this.groupedConstraint(propName);

    // support for groupd constraints
    if (names && this.isEnabled(propName)) {
      names.map(name => this.addConstraint(name, { ...opts, enabled: true }));
    }
    let { constraintName, method, value, errName, enabled } = opts;

    const propValue = this.constraints[propName];
    if (!propValue) {
      return this;
    }
    constraintName = constraintName || propName;
    if (!enabled && !this.isEnabled(constraintName)) {
      return this;
    }
    method = method || constraintName;
    const apiMethod = this.base[method];
    if (!apiMethod) {
      this.warn(`Yup has no such API method: ${method}`);
      return this;
    }
    const constraintFn = apiMethod.bind(this.base);
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));
    const constraintValue = value === true ? undefined : value;
    this.onConstraintAdded({ name: constraintName, value, constraintValue });
    const newBase = constraintValue
      ? constraintFn(constraintValue, errFn)
      : constraintFn(errFn);
    this.base = newBase || this.base;
    return this;
  }

  onConstraintAdded({ name, value }) {
    this.constraintsAdded[name] = value;
    return this;
  }

  addMappedConstraintsFor($map) {
    const keys = Object.keys($map);
    keys.map(key => {
      const list = $map[key];
      const constraintName =
        key === "value" ? "addValueConstraint" : "addConstraint";
      list.map(this[constraintName]);
    });
    return this;
  }

  isEnabled(name) {
    return this.allEnabled.includes(name);
  }

  addMappedConstraints() {
    this.addMappedConstraintsFor(this.constraintsMap);
  }

  // override for each type
  get enabled() {
    [];
  }

  convertEnabled() {
    this.allEnabled.map(name => {
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

  valErrMessage(constraint) {
    const errMsg = this.errMessages[this.key]
      ? this.errMessages[this.key][constraint]
      : undefined;
    return typeof errMsg === "function" ? errMsg(this.constraints) : errMsg;
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

  get constraintsMap() {
    return {};
  }

  // throw ConvertYupSchemaError(fullMsg);
  throwError(msg) {
    throw msg;
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
}

module.exports = {
  YupBaseType
};
