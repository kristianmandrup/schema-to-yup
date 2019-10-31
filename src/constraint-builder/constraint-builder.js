import {
  NoValueConstraintBuilder,
  SingleValueConstraintBuilder,
  ListValueConstraintBuilder
} from "./constraint-type";
import { Loggable } from "../_loggable";
import { contraintFnFor } from "./utils";

export class ConstraintBuilder extends Loggable {
  constructor(opts = {}) {
    super(opts);
    this.constraints = opts.constraints || {};
    this.typeConstrainerInst = opts.typeConstrainerInst;
    this.errMessages = opts.errMessages || {};
    this.opts = opts;
  }

  isNothing(val) {
    return val === undefined || val === null;
  }

  isPresent(num) {
    return !this.isNothing(num);
  }

  build(propertyName, opts = {}) {
    let { typeConstrainerInst } = opts;
    typeConstrainerInst = typeConstrainerInst || this.typeConstrainerInst;

    if (!propertyName) {
      this.error("build: missing prop name");
    }

    const constraintValue = this.constraintValueFor({ ...opts, propertyName });

    if (this.isNothing(constraintValue)) {
      this.warn("no prop value");
      return typeConstrainerInst;
    }

    const constraint = this.createConstraint({
      ...opts,
      constraintValue,
      propertyName
    });
    // console.log("built", { constraint });
    if (constraint) return constraint;

    this.warn("No type constrainer instance could be built", {
      propertyName,
      opts
    });
    return typeConstrainerInst;
  }

  constraintValueFor(opts = {}) {
    const { constraintValue, propertyValue, propertyName } = opts;
    return constraintValue || propertyValue || this.constraints[propertyName];
  }

  createConstraint(options = {}) {
    const { constraintName, propertyName, constraintValue } = options;
    let { constraintMethodName } = options;
    constraintMethodName = constraintMethodName || propertyName;
    method = method || constraintName;

    const opts = this.createConstraintOpts({
      ...options,
      constraintMethodName,
      typeConstrainerInst: this.typeConstrainerInst,
      constraintName
    });
    return (
      this.constraintWithValues(constraintValue, opts) ||
      this.constraintWithSingleValue(constraintValue, opts) ||
      this.constraintWithNoValue(constraintValue, opts)
    );
  }

  createConstraintOpts(opts = {}) {
    const { constraintName, errorName, type } = opts;
    let { constraintMethodName } = opts;
    constraintMethodName = this.getTypeConstrainerMethodName(
      constraintMethodName || constraintName
    );
    const typeConstrainerInst =
      opts.typeConstrainerInst || this.typeConstrainerInst;

    const constraintFn = contraintFnFor({
      typeConstrainerInst,
      constraintMethodName,
      ...opts
    });

    const errorFn = this.createErrorFn({ constraintName, errorName });

    return {
      constraintFn,
      errorFn,
      constraintName,
      constraintMethodName,
      type
    };
  }

  createErrorFn({ constraintName, errorName }) {
    return (
      this.getErrorMessageFnFor(constraintName) ||
      (errorName && this.getErrorMessageFnFor(errorName))
    );
  }

  getErrorMessageFnFor(name) {
    const errorMessageMap = this.errMessages[this.key];
    const errorMsgOrHandler = errorMessageMap && errorMessageMap[name];
    if (!errorMsgOrHandler) return;
    return typeof errorMsgOrHandler === "function"
      ? errorMsgOrHandler
      : () => errorMsgOrHandler;
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

  getTypeConstrainerMethodName(name) {
    name = this.aliasMap[name] || name;
    if (this.isNothing(name) || name === "") {
      this.error("Invalid yup contraint method name", name);
    }
    return name;
  }
}
