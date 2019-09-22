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
      value,
      values,
      errName
    } = opts;
    yup = yup || this.base;
    constraintValue =
      constraintValue || propValue || this.constraints[propName];

    if (this.isNothing(constraintValue)) {
      // console.log("no prop value", { constraints: this.constraints, propName });
      this.warn("no prop value");
      return yup;
    }
    constraintName = constraintName || propName;
    method = method || constraintName;

    const yupConstraintMethodName = this.aliasMap[method] || method;

    if (!yup[yupConstraintMethodName]) {
      // console.log("no yup method", yupConstraintMethodName);
      this.warn(`Yup has no such API method: ${yupConstraintMethodName}`);
      return this;
    }

    const constraintFn = yup[yupConstraintMethodName].bind(yup);
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));

    // console.log("build constraint", {
    //   value,
    //   values,
    //   propName,
    //   constraints: this.constraints
    // });

    if (!this.isPresent(constraintValue)) {
      // this.log("constraint - value not present", value);

      // call yup constraint function with single value arguments (default)
      // constraintValue = value === true ? constraintValue : value;

      this.onConstraintAdded({ name: constraintName });

      const newBase = constraintFn(errFn);

      // this.log("built constraint", {
      //   yup: newBase
      // });

      return newBase;
    }

    if (this.isPresent(values)) {
      // this.log("constraint - values present - add Array constraint", values);

      // call yup constraint function with multiple arguments
      if (!Array.isArray(values)) {
        this.warn(
          "buildConstraint: values option must be an array of arguments"
        );
        return yup;
      }

      this.onConstraintAdded({ name: constraintName, value: values });

      const newBase = constraintFn(values, errFn);

      // this.log("built constraint", {
      //   yup: newBase
      // });

      return newBase;
    }

    if (this.isPresent(constraintValue)) {
      // this.log("constraint - value not present", value);

      this.onConstraintAdded({ name: constraintName, value: constraintValue });

      const newBase = constraintValue
        ? constraintFn(constraintValue, errFn)
        : constraintFn(errFn);

      // this.log("built constraint", {
      //   yup: newBase
      // });

      return newBase;
    }

    this.warn("buildConstraint: missing value or values options");
    return yup;
  }

  addConstraint(propName, opts) {
    // console.log("addConstraint", propName, opts);
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
