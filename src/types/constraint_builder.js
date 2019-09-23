export class ConstraintBuilder {
  constructor(opts = {}) {}

  // TODO
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

    this.warn("buildConstraint: missing value or values options");
    return yup;
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
}
