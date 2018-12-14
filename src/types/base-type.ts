const yup = require("yup");
const { Base } = require("./base");
const {
  createStringConstraint,
  createRegExpConstraint,
  createDateConstraint,
  createNumericConstraint
} = require("./constraints");
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

  processValueConstraint(propName, { constraintName, errName } = {}) {
    return this.processConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  groupedConstraint(name) {
    return (this.grouped || {})[name];
  }

  processConstraint(propName, opts = {}) {
    const names = this.groupedConstraint(propName);

    // support for groupd constraints
    if (names && this.isEnabled(propName)) {
      // allow group type
      const type = this.constraintsTypeMap[propName];
      names.map(name =>
        this.processConstraint(name, { ...opts, enabled: true, type })
      );
    }
    let { constraintName, method, value, enabled, type } = opts;

    const propValue = this.constraints[propName];
    if (!propValue) {
      return this;
    }
    constraintName = constraintName || propName;
    if (!enabled && !this.isEnabled(constraintName)) {
      return this;
    }
    method = method || constraintName;
    const error = this.errorMessageFor(constraintName);
    const constraintValue = value === true ? undefined : value;
    this.onConstraintAdded({ name: constraintName, value, constraintValue });
    const newBase = constraintValue
      ? this.addValueConstraint(constraintName, constraintValue, {
          error,
          type
        })
      : this.switchOnConstraint(method, error);
    this.validatorTypeApi = newBase || this.base;
    return this;
  }

  addValueConstraint(name, value, { error, type }) {
    const constraintType = type || this.constraintsTypeMap[name];
    if (!constraintType) {
      return this.applyConstraintToValidator(name, value, error);
    }
    const typedContraintFactory = this.typedContraintFactoryMap[constraintType];
    typedContraintFactory(value);
  }

  applyConstraintToValidator(name, value, method) {
    method = method || name;
    if (this.base[method]) {
      this.validatorTypeApi = this.base[method](value);
    }
    return this;
  }

  get typedContraintFactoryMap() {
    return {
      string: createStringConstraint,
      regexp: createRegExpConstraint,
      date: createDateConstraint,
      numeric: createNumericConstraint
    };
  }

  get constraintsTypeMap() {
    return {};
  }

  switchOnConstraint(method, error) {
    const apiMethod = this.base[method];
    if (!apiMethod) {
      this.warn(`Yup has no such API method: ${method}`);
      return this;
    }
    apiMethod(error);
  }

  errorMessageFor(name) {
    const aliases = this.fullAliasMap[name] || [];
    let errMsg;
    aliases.find(alias => {
      errMsg = errMsg || this.valErrMessage(alias);
    });
    return errMsg;
  }

  onConstraintAdded({ name, value }) {
    this.constraintsAdded[name] = value;
    return this;
  }

  processMappedConstraintsFor($map) {
    const keys = Object.keys($map);
    keys.map(key => {
      const list = $map[key];
      const constraintName =
        key === "value" ? "processValueConstraint" : "processConstraint";
      list.map(this[constraintName]);
    });
    return this;
  }

  isEnabled(name) {
    return this.allEnabled.includes(name);
  }

  processMappedConstraints() {
    this.processMappedConstraintsFor(this.constraintsMap);
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

  normalize() {
    const fullAliasMap = {
      ...this.aliasMap,
      ...this.baseAliasMap
    };
    Object.keys(fullAliasMap).map(key => {
      const aliases = this.aliasMap[key];
      aliases.map(alias => {
        this.constraints[key] = this.constraints[key] || alias;
      });
    });
  }

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
}

module.exports = {
  YupBaseType
};
