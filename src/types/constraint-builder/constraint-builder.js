import { SingleValueConstraintBuilder } from "./constraint/single-value";
import { ListValueConstraintBuilder } from "./constraint/list-value";
import { NoValueConstraintBuilder } from "./constraint/no-value";
import { Loggable } from "../_loggable";

export class ConstraintBuilder extends Loggable {
  constructor(opts = {}) {
    super(opts);
    // console.log("ConstraintBuilder", { opts });
    this.constraints = opts.constraints || {};
    this.base = opts.base;
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
    yup = yup || this.base;
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
      constraintName
    });

    return (
      this.constraintWithValues(constraintValue, opts) ||
      this.constraintWithSingleValue(constraintValue, opts) ||
      this.constraintWithNoValue(constraintValue, opts)
    );
  }

  createConstraintOpts(opts = {}) {
    const { method, constraintName, errName } = opts;
    const yupConstraintMethodName = this.getYupConstraintMethodName(method);
    const yup = opts.yup || this.base;

    if (!yup[yupConstraintMethodName]) {
      this.warn(`Yup has no such API method: ${yupConstraintMethodName}`);
      return this;
    }

    const constraintFn = yup[yupConstraintMethodName].bind(yup);
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));

    return { constraintFn, errFn, constraintName };
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
    return this.aliasMap[name] || name;
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

  createConstraintOpts(opts) {
    return {
      ...this.opts.config,
      ...opts,
      onConstraintAdded: this.onConstraintAdded
    };
  }

  createNoValueConstraintBuilder(opts = {}) {
    return new NoValueConstraintBuilder(this.createConstraintOpts(opts));
  }

  createListValueConstraintBuilder(opts = {}) {
    return new ListValueConstraintBuilder(this.createConstraintOpts(opts));
  }

  createSingleValueConstraintBuilder(opts = {}) {
    return new SingleValueConstraintBuilder(this.createConstraintOpts(opts));
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
    this.base = contraint || this.base;
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
}
