import {
  NoValueConstraintBuilder,
  SingleValueConstraintBuilder,
  ListValueConstraintBuilder
} from "./constraint";
import { Loggable } from "../_loggable";
import { yupContraintFnFor } from "./utils";

export class ConstraintBuilder extends Loggable {
  constructor(opts = {}) {
    super(opts);
    // console.log("ConstraintBuilder", { opts });
    this.constraints = opts.constraints || {};
    this.yupTypeInst = opts.yupTypeInst;
    this.errMessages = opts.errMessages || {};
    this.opts = opts;
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }

  build(propName, opts = {}) {
    let { yup } = opts;
    yup = yup || this.yupTypeInst;

    if (!propName) {
      this.error("build: missing prop name");
    }

    const constraintValue = this.constraintValueFor({ ...opts, propName });

    if (this.isNothing(constraintValue)) {
      this.warn("no prop value");
      return yup;
    }

    const constraint = this.createConstraint({
      ...opts,
      constraintValue,
      propName
    });
    // console.log("built", { constraint });
    if (constraint) return constraint;

    this.warn("No Yup constraint could be built", { propName, opts });
    return yup;
  }

  constraintValueFor(opts = {}) {
    const { constraintValue, propValue, propName } = opts;
    return constraintValue || propValue || this.constraints[propName];
  }

  createConstraint(options = {}) {
    let { method, constraintName, propName, constraintValue } = options;
    constraintName = constraintName || propName;
    method = method || constraintName;

    const opts = this.createConstraintOpts({
      ...options,
      method,
      yupTypeInst: this.yupTypeInst,
      constraintName
    });
    return (
      this.constraintWithValues(constraintValue, opts) ||
      this.constraintWithSingleValue(constraintValue, opts) ||
      this.constraintWithNoValue(constraintValue, opts)
    );
  }

  createConstraintOpts(opts = {}) {
    const { method, constraintName, errName, type } = opts;
    const yupConstraintMethodName = this.getYupConstraintMethodName(
      method || opts.yupConstraintMethodName
    );
    const yupTypeInst = opts.yupTypeInst || this.yupTypeInst;
    const methodName = yupConstraintMethodName;
    const constraintFn = yupContraintFnFor({
      yupTypeInst,
      methodName,
      ...opts
    });
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));

    return {
      constraintFn,
      errFn,
      constraintName,
      yupConstraintMethodName,
      type
    };
  }

  valErrMessage(constraint) {
    const errMsg = this.errMessages[this.key]
      ? this.errMessages[this.key][constraint]
      : undefined;
    return typeof errMsg === "function" ? errMsg(this.constraints) : errMsg;
  }

  get mixedAliasMap() {
    return {
      oneOf: "oneOf",
      enum: "oneOf",
      anyOf: "oneOf"
      // ... TODO: add more to cover all mixed aliases
    };
  }

  get aliasMap() {
    return {
      ...this.mixedAliasMap
      // TODO: override on individual type class to add more type specific aliases
    };
  }

  getYupConstraintMethodName(name) {
    name = this.aliasMap[name] || name;
    if (this.isNothing(name) || name === "") {
      this.error("Invalid yup contraint method name", name);
    }
    return name;
  }

  constraintWithSingleValue(constraintValue, opts = {}) {
    if (!this.isPresent(constraintValue)) return;
    return this.createSingleValueConstraintBuilder(opts).build(constraintValue);
  }

  constraintWithValues(values, opts = {}) {
    if (!this.isPresent(values)) return;
    return this.createListValueConstraintBuilder(opts).build(values);
  }

  constraintWithNoValue(opts = {}) {
    return this.createNoValueConstraintBuilder(opts).build(opts.name, opts);
  }

  createNoValueConstraintBuilder(opts = {}) {
    opts = this.createConstraintOpts(opts);
    return new NoValueConstraintBuilder(opts);
  }

  createListValueConstraintBuilder(opts = {}) {
    opts = this.createConstraintOpts(opts);
    return new ListValueConstraintBuilder(opts);
  }

  createSingleValueConstraintBuilder(opts = {}) {
    opts = this.createConstraintOpts(opts);
    return new SingleValueConstraintBuilder(opts);
  }

  addValueConstraint(propName, { constraintName, errName } = {}) {
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName
    });
  }

  addConstraint(propName, opts) {
    // console.log("addConstraint", propName, opts);
    const contraint = this.build(propName, opts);
    this.yupTypeInst = contraint || this.yupTypeInst;
    return this;
  }

  onConstraintAdded({ name, value }) {
    // this.constraintsAdded[name] = value;
    return this;
  }

  addMappedConstraints(constraintsMap) {
    const $map = constraintsMap || this.constraintsMap;
    const keys = Object.keys($map);
    keys.map(key => {
      const list = $map[key];
      const ctx = {
        list,
        key
      };

      if (!list) {
        this.error(
          `addMappedConstraints: missing constraintsMap entry for ${key}`,
          ctx
        );
      }
      if (!Array.isArray(list)) {
        this.error(
          `addMappedConstraints: constraintsMap entry for ${key} is not a list`,
          ctx
        );
      }

      const fnName = key === "value" ? "addValueConstraint" : "addConstraint";
      const fn = this[fnName];
      list.map(fn);
    });
    return this;
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }
}
