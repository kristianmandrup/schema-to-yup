export class ConstraintAdder {
  addValueConstraint(propertyName, { constraintName, errName } = {}) {
    return this.addConstraint(propertyName, {
      constraintName,
      value: true,
      errName
    });
  }

  addConstraint(propertyName, opts) {
    // console.log("addConstraint", propertyName, opts);
    const contraint = this.build(propertyName, opts);
    this.typeConstrainerInst = contraint || this.typeConstrainerInst;
    return this;
  }

  onConstraintAdded({ name, value }) {
    // this.constraintsAdded[name] = value;
    return this;
  }

  addMappedConstraints(constraintsMap) {
    constraintsMap = constraintsMap || this.constraintsMap;
    const keys = Object.keys(constraintsMap);
    keys.map(key => {
      const constraintEntryForKey = constraintsMap[key];
      this.validator = this.createConstraintEntryValidator({
        key,
        constraintEntryForKey
      });
      this.validate();
      // TODO: fix this
      const fnName = key === "value" ? "addValueConstraint" : "addConstraint";
      const fn = this[fnName];
      list.map(fn);
    });
    return this;
  }

  createConstraintEntryValidator(opts) {
    return new ConstraintEntryValidator(opts);
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }
}
