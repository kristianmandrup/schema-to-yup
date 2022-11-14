import { TypeMatcher } from "./types/_type-matcher";
import * as Yup from "yup";
export class ConstraintBuilder extends TypeMatcher {
  constructor(typeHandler, config = {}) {
    super(config);
    this.typeHandler = typeHandler;
    this.type = typeHandler.type;
    this.builder = typeHandler.builder;
    this.constraintsAdded = {};
    this.delegators.map((name) => {
      this[name] = typeHandler[name];
    });
  }

  get delegators() {
    return [
      "errMessages",
      "base",
      "key",
      "type",
      "constraints",
      "errorMessageHandler",
      "logInfo",
      "warn",
    ];
  }

  build(propName, opts = {}) {
    let {
      constraintName,
      constraintValue,
      propValue,
      method,
      yup,
      value,
      values,
      errName,
    } = opts;
    yup = yup || this.base;

    // find the first value that is present (must not be undefined or null)
    const potentialValues = [
      constraintValue,
      propValue,
      this.constraints[propName],
    ];
    constraintValue = this.getFirstValue(potentialValues);

    constraintName = constraintName || propName;
    method = method || constraintName;
    this.idObj = { propName, method, constraintName, key: this.key };

    if (this.isNothing(constraintValue)) {
      this.warn("no prop value", { constraintValue });
      return false;
    }

    const yupConstraintMethodName = this.aliasMap[method] || method;

    if (!yup[yupConstraintMethodName]) {
      const msg = `Yup has no such API method: ${yupConstraintMethodName}`;
      this.warn(msg);
      return false;
    }

    const constraintFn = yup[yupConstraintMethodName].bind(yup);

    const constraintErrMsg = this.validationErrorMessage(constraintName);
    const errErrMsg = errName && this.validationErrorMessage(errName);
    const errFn = constraintErrMsg || errErrMsg;

    this.logDetailed("build", opts, {
      resolved: {
        constraintValue,
        constraintName,
        method,
        constraintErrMsg,
        errErrMsg,
        errFn,
      },
    });

    const constrOpts = {
      constraintName,
      yup,
      constraintFn,
      errFn,
    };

    const constrainFnNames = [
      "multiValueConstraint",
      "presentConstraintValue",
      "nonPresentConstraintValue",
    ];
    let newBase;
    const type = this.type;
    for (let name of constrainFnNames) {
      const fnName = this[name].bind(this);
      const constrValue = this.getFirstValue([value, values, constraintValue], {
        constraintName,
        type,
      });
      newBase = fnName(constrValue, constrOpts);
      if (newBase) break;
    }

    if (newBase) {
      // const { _whitelist } = newBase;
      // const list = _whitelist && _whitelist.list;
      this.base = newBase;
      return newBase;
    }

    this.warn("buildConstraint: missing value or values options");
    return false;
  }

  yupRefMap() {
    return {
      string: ["length", "min", "max"],
      number: ["min", "max", "lessThan", "moreThan"],
      date: ["min", "max"],
      array: ["length", "min", "max"],
    };
  }

  getFirstValue(potentialValues, opts = {}) {
    const { constraintName, type } = opts;
    const isDefined = this.isPresent.bind(this);
    const yupRefConstraints = this.yupRefMap[type];
    const value = potentialValues.filter(isDefined)[0];
    if (yupRefConstraints) {
      const useYupRef = yupRefConstraints.includes(constraintName);
      if (useYupRef && this.isStringType(value)) {
        return Yup.ref(value);
      }
    }
    return value;
  }

  nonPresentConstraintValue(
    constraintValue,
    { constraintName, constraintFn, errFn }
  ) {
    if (this.isPresent(constraintValue)) return;
    this.logInfo("nonPresentConstraintValue", { constraintValue });

    this.onConstraintAdded({
      method: "nonPresentConstraintValue",
      name: constraintName,
      errFn,
    });

    const newBase = constraintFn(errFn);
    return newBase;
  }

  presentConstraintValue(
    constraintValue,
    { constraintName, constraintFn, errFn }
  ) {
    if (!this.isPresent(constraintValue)) {
      this.logInfo("presentConstraintValue: value not present", {
        constraintName,
        constraintValue,
      });
      return;
    }
    this.logInfo("presentConstraintValue", {
      constraintName,
      constraintValue,
    });

    this.onConstraintAdded({
      method: "presentConstraintValue",
      name: constraintName,
      value: constraintValue,
      errFn,
    });

    if (this.isNoValueConstraint(constraintName)) {
      this.logInfo("isNoValueConstraint", { constraintName });
      let specialNewBase = constraintFn(errFn);
      return specialNewBase;
    }
    this.logInfo("presentConstraintValue: apply validator function", {
      constraintName,
      constraintValue,
    });
    const newBase = constraintFn(constraintValue, errFn);
    return newBase;
  }

  multiValueConstraint(values, { constraintFn, constraintName, errFn }) {
    if (!this.isPresent(values)) return;

    this.logInfo("multiValueConstraint", { constraintName, values });
    // call yup constraint function with multiple arguments
    if (!Array.isArray(values)) {
      this.warn("buildConstraint: values option must be an array of arguments");
      return;
    }

    this.onConstraintAdded({
      method: "multiValueConstraint",
      name: constraintName,
      value: values,
      errFn,
    });
    this.logInfo("multiValueConstraint: apply validator function", {
      constraintName,
      value: values,
    });

    return this.callConstraintFn(constraintFn, constraintName, values, errFn);
  }

  callConstraintFn(constraintFn, constraintName, values, errFn) {
    const isMulti = this.isMultiArgsCall(constraintName);
    return isMulti
      ? constraintFn(...values, errFn)
      : constraintFn(values, errFn);
  }

  isMultiArgsCall(constraintName) {
    return this.multiArgsValidatorMethods[constraintName];
  }

  get multiArgsValidatorMethods() {
    return (
      this.config.multiArgsValidatorMethods || {
        when: true,
      }
    );
  }

  isNoValueConstraint(constraintName) {
    return this.noValueConstraints.includes(constraintName);
  }

  get noValueConstraints() {
    return ["required", "email", "url", "format"];
  }

  addTrueValueConstraint(propName, { constraintName, errName } = {}) {
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName,
    });
  }

  addConstraint(propName, opts) {
    const constraint = this.build(propName, opts);
    if (constraint) {
      this.typeHandler.base = constraint;
      // const { _whitelist } = constraint;
      // const list = _whitelist && _whitelist.list;
      return constraint;
    }
    return false;
  }

  onConstraintAdded({ method, name, value, errFn }) {
    this.constraintsAdded[name] = value;
    if (!this.builder) {
      this.logInfo("no builder set to notify in ConstraintBuilder");
      return;
    }
    this.builder.onConstraintAdded({
      type: this.type,
      method,
      name,
      value,
      errFn,
    });
    return this.typeHandler;
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"],
    };
  }

  // propName, method, key
  logDetailed(label, ...values) {
    const idObj = this.idObj;
    this.logDetails(label, idObj, ...values);
  }

  validationErrorMessage(msgName) {
    return this.errorMessageHandler.validationErrorMessage(msgName);
  }

  get aliasMap() {
    return {
      oneOf: "oneOf",
      enum: "oneOf",
      anyOf: "oneOf",
      // ...
    };
  }
}
