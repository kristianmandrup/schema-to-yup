import { TypeMatcher } from "./types/_type-matcher";

export class ConstraintBuilder extends TypeMatcher {
  constructor(typeHandler, config = {}) {
    super(config);
    this.typeHandler = typeHandler;
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
      values,
      errName
    } = opts;
    yup = yup || this.base;

    constraintValue =
      constraintValue || propValue || this.constraints[propName];

    if (this.isNothing(constraintValue)) {
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

    const constraintErrMsg = this.valErrMessage(constraintName);
    const errErrMsg = errName && this.valErrMessage(errName);

    const errFn = constraintErrMsg || errErrMsg;

    const constrOpts = {
      constraintName,
      yup,
      constraintFn,
      errFn
    };

    const newBase =
      this.multiValueConstraint(values, constrOpts) ||
      this.presentConstraintValue(constraintValue, constrOpts) ||
      this.nonPresentConstraintValue(constraintValue, constrOpts);

    if (newBase) {
      const { _whitelist } = newBase;
      const list = _whitelist && _whitelist.list;
      console.log({ newBase, whitelist: list });
      return newBase;
    }

    this.warn("buildConstraint: missing value or values options");
    return yup;
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
    console.log("multiValueConstraint", values, errFn);
    const newBase = constraintFn(values, errFn);
    console.log("multiValueConstraint", newBase);
    return newBase;
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
      console.log("addConstraint", propName, constraint);
      this.typeHandler.base = constraint;
      const { _whitelist } = constraint;
      const list = _whitelist && _whitelist.list;
      console.log({ list });
    }
    return this.typeHandler;
  }

  onConstraintAdded({ name, value }) {
    this.constraintsAdded[name] = value;
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
