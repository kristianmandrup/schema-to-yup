import { TypeMatcher } from "./types/_type-matcher";

export class ConstraintBuilder extends TypeMatcher {
  constructor(typeHandler, config = {}) {
    super(config);
    this.typeHandler = typeHandler;
    this.type = typeHandler.type
    this.builder = typeHandler.builder
    this.constraintsAdded = {};
    this.delegators.map(name => {
      this[name] = typeHandler[name];
    });
  }

  get delegators() {
    return ["errMessages", "base", "key", "constraints", "errorMessageHandler"];
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
      errName
    } = opts;
    yup = yup || this.base;

    constraintValue =
      constraintValue || propValue || this.constraints[propName];

    if (this.isNothing(constraintValue)) {
      this.warn("no prop value");
      return false;
    }
    constraintName = constraintName || propName;
    method = method || constraintName;

    const yupConstraintMethodName = this.aliasMap[method] || method;

    if (!yup[yupConstraintMethodName]) {
      const msg = `Yup has no such API method: ${yupConstraintMethodName}`;
      this.warn(msg);
      return false;
    }

    const constraintFn = yup[yupConstraintMethodName].bind(yup);

    const constraintErrMsg = this.valErrMessage(constraintName);
    const errErrMsg = errName && this.valErrMessage(errName);

    const errFn = constraintErrMsg || errErrMsg;

    const constrOpts = {
      constraintName,
      yup,
      constraintFn,
      errFn
    };

    const constrainFnNames = [
      "multiValueConstraint",
      "presentConstraintValue",
      "nonPresentConstraintValue"
    ];
    let newBase;
    for (let name of constrainFnNames) {
      newBase = this[name](value || values, constrOpts);
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

  nonPresentConstraintValue(
    constraintValue,
    { constraintName, constraintFn, errFn }
  ) {
    if (this.isPresent(constraintValue)) return;

    this.onConstraintAdded({ name: constraintName });

    const newBase = constraintFn(errFn);
    return newBase;
  }

  presentConstraintValue(
    constraintValue,
    { constraintName, constraintFn, errFn }
  ) {
    if (!this.isPresent(constraintValue)) return;

    this.onConstraintAdded({ name: constraintName, value: constraintValue });

    if (this.isNoValueConstraint(constraintName)) {
      let specialNewBase = constraintFn(errFn);
      return specialNewBase;
    }

    // console.log("presentConstraintValue", { constraintName, constraintValue });
    const newBase = constraintFn(constraintValue, errFn);
    return newBase;
  }

  multiValueConstraint(values, { constraintFn, constraintName, errFn }) {
    if (!this.isPresent(values)) return;

    // call yup constraint function with multiple arguments
    if (!Array.isArray(values)) {
      this.warn("buildConstraint: values option must be an array of arguments");
      return;
    }

    this.onConstraintAdded({ name: constraintName, value: values });
    // console.log(constraintFn, { constraintName, values });

    return this.callConstraintFn(constraintFn, constraintName, values, errFn);
  }

  callConstraintFn(constraintFn, constraintName, values, errFn) {
    const isMulti = this.isMultiArgsCall(constraintName);
    // console.log({ constraintName, isMulti });
    // if (isMulti) {
    //   console.log(constraintName, ...values);
    // }
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
        when: true
      }
    );
  }

  isNoValueConstraint(constraintName) {
    return this.noValueConstraints.includes(constraintName);
  }

  get noValueConstraints() {
    return ["required", "email", "url", "format"];
  }

  addValueConstraint(propName, { constraintName, errName } = {}) {
    return this.addConstraint(propName, {
      constraintName,
      value: true,
      errName
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

  onConstraintAdded({ name, value }) {
    this.constraintsAdded[name] = value;
    this.builder && this.builder.onConstraintAdded({ type: this.type, name, value })
    return this.typeHandler;
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }

  valErrMessage(msgName) {
    return this.errorMessageHandler.valErrMessage(msgName);
  }

  get aliasMap() {
    return {
      oneOf: "oneOf",
      enum: "oneOf",
      anyOf: "oneOf"
      // ...
    };
  }
}
