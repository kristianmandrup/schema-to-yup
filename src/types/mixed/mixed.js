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
    this.constraintBuilder = this.createConstraintBuilder(this);

    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
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
    // this.addMappedConstraints();
    // this.oneOf().notOneOf();
    // this.when();
    // this.nullable().isType();
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
      // this.log("constraint value present", { constraintValue });

      this.onConstraintAdded({ name: constraintName, value: constraintValue });

      const newBase = this.isPresent(constraintValue)
        ? constraintFn(constraintValue, errFn)
        : constraintFn(errFn);

      // this.log("built constraint", {
      //   yup: newBase
      // });

      return newBase;
    }

    if (!this.isPresent(constraintValue)) {
      // this.log("constraint - value not present, pass no value", {
      //   constraintValue
      // });

      // call yup constraint function with single value arguments (default)
      // constraintValue = value === true ? constraintValue : value;

      this.onConstraintAdded({ name: constraintName });

      const newBase = constraintFn(errFn);

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
    const obj = this.value;
    keys.map(key => {
      const list = $map[key];
      const fnName = key === "value" ? "addValueConstraint" : "addConstraint";
      console.log("addMappedConstraints", { key, fnName });
      const fn = this[fnName];
      console.log("add property constraint for", {
        key: this.key,
        constraintValue: this.value,
        list
      });
      // iterate all constraints in constraintsMap for key such as simple or value
      list.map(constraintName => {
        const constraintValue = obj[constraintName];
        const propName = obj.key;
        console.log({ constraintName, propName, constraintValue, fnName });
        console.log({ constraintName, propName, constraintValue, fnName });
        if (!constraintValue) {
          if (constraintName === "required") {
            console.log("notRequired", {
              propName,
              constraintName,
              constraintValue
            });
            console.log(`adding constraint notRequired for ${propName}`);
            this[fnName]("notRequired");
            return;
          }
          console.log(
            `not adding constraint ${constraintName} for ${propName}`
          );
          return;
        }
        console.log(`adding constraint ${constraintName} for ${propName}`);
        this[fnName](constraintName);
      });
    });
    return this;
  }

  get constraintsMap() {
    return {
      // simple: ["nullable", "required", "notRequired"],
      // value: ["default", "strict"]
    };
  }

  nullable() {}

  required() {}

  notRequired() {}

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

export { YupMixed, ConvertYupSchemaError };
