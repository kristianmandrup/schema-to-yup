import * as yup from "yup";

// import { buildYup } from "../";

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

function isObjectType(obj) {
  return obj === Object(obj);
}

import { Base } from "./base";
import { createWhenCondition } from "../conditions";

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

    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
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
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  buildConstraint(propName, opts = {}) {
    let {
      constraintName,
      propValue,
      method,
      yup,
      value,
      values,
      errName
    } = opts;
    yup = yup || this.base;
    propValue = propValue || this.constraints[propName];

    if (this.isNothing(propValue)) {
      this.warn("no prop value");
      return yup;
    }
    constraintName = constraintName || propName;
    method = method || constraintName;

    if (!yup[method]) {
      this.warn(`Yup has no such API method: ${method}`);
      return this;
    }

    const yupConstraintFn = yup[method];
    if (!yupConstraintFn) {
      return this.error("No such yup constrain method", { method });
    }
    const constraintFn = yupConstraintFn.bind(yup);
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));

    // this.log("build constraint", {
    //   value,
    //   propName,
    //   constraints: this.constraints
    // });

    if (!this.isPresent(value)) {
      // this.log("constraint - value not present", value);

      // call yup constraint function with single value arguments (default)
      const constraintValue = value === true ? propValue : value;

      this.onConstraintAdded({ name: constraintName, value: constraintValue });

      const newBase = constraintValue
        ? constraintFn(constraintValue, errFn)
        : constraintFn(errFn);

      // this.log("built constraint", {
      //   yup: newBase
      // });

      return newBase;
    }

    if (this.isPresent(value)) {
      // this.log("constraint - value present", value);

      // call yup constraint function with multiple arguments
      if (!Array.isArray(values)) {
        this.onConstraintAdded({ name: constraintName, value });

        const newBase = constraintFn([value], errFn);
        return newBase;

        // this.warn(
        //   "buildConstraint: values option must be an array of arguments"
        // );
        // return yup;
      }

      this.onConstraintAdded({ name: constraintName, value: values });

      const newBase = constraintFn(...values, errFn);

      // this.log("built constraint", {
      //   yup: newBase
      // });

      return newBase;
    }
    this.warn("buildConstraint: missing value or values options");
    return yup;
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
    let value =
      this.constraints.enum || this.constraints.oneOf || this.constraints.anyOf;
    if (this.isNothing(value)) return this;
    value = Array.isArray(value) ? value : [value];
    return this.addConstraint("oneOf", { value, errName: "enum" });
  }

  notOneOf() {
    const { not, notOneOf } = this.constraints;
    let value = notOneOf || (not && (not.enum || not.oneOf));
    value = Array.isArray(value) ? value : [value];
    return this.addConstraint("notOneOf", { value });
  }

  valErrMessage(constraint) {
    const errMsg = this.errMessages[this.key]
      ? this.errMessages[this.key][constraint]
      : undefined;
    return typeof errMsg === "function" ? errMsg(this.constraints) : errMsg;
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
    return createWhenCondition(opts);
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

export { defaults, errValKeys, YupMixed, ConvertYupSchemaError };
