import { TypeMatcher } from "./_type-matcher";

export class ConstraintBuilder extends TypeMatcher {
  constructor(typeHandler, opts = {}) {
    super(opts);
    this.typeHandler = typeHandler;
    this.constraintsAdded = {};
    this.delegators.map(name => {
      this[name] = typeHandler[name];
    });
  }

  get delegators() {
    return ["errMessages", "base", "key", "constraints"];
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

    console.log(propName, opts);

    if (this.isNothing(constraintValue)) {
      this.warn("no prop value");
      return yup;
    }
    constraintName = constraintName || propName;
    method = method || constraintName;

    const yupConstraintMethodName = this.aliasMap[method] || method;

    if (!yup[yupConstraintMethodName]) {
      this.warn(`Yup has no such API method: ${yupConstraintMethodName}`);
      return this.typeHandler;
    }

    const constraintFn = yup[yupConstraintMethodName].bind(yup);
    const errFn =
      this.valErrMessage(constraintName) ||
      (errName && this.valErrMessage(errName));

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

    if (newBase) return newBase;

    this.warn("buildConstraint: missing value or values options");
    return yup;
  }

  nonPresentConstraintValue(
    constraintValue,
    { constraintName, constraintFn },
    errFn
  ) {
    if (this.isPresent(constraintValue)) return;
    // call yup constraint function with single value arguments (default)

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
    const newBase = this.isPresent(constraintValue)
      ? constraintFn(constraintValue, errFn)
      : constraintFn(errFn);

    return newBase;
  }

  multiValueConstraint(values, { constraintName, yup, errFn }) {
    if (!this.isPresent(values)) return;
    // call yup constraint function with multiple arguments
    if (!Array.isArray(values)) {
      this.warn("buildConstraint: values option must be an array of arguments");
      return yup;
    }

    this.onConstraintAdded({ name: constraintName, value: values });
    const newBase = constraintFn(values, errFn);
    return newBase;
  }

  isNoValueConstraint(constraintName) {
    return this.noValueConstraints.includes(constraintName);
  }

  get noValueConstraints() {
    return ["required", "email", "url"];
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
    const constraint = this.build(propName, opts);
    this.base = constraint || this.base;
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

  valErrMessage(constraint) {
    const errMsg = this.errMessages[this.key]
      ? this.errMessages[this.key][constraint]
      : undefined;
    return typeof errMsg === "function" ? errMsg(this.constraints) : errMsg;
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
