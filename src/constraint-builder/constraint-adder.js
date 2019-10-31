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
