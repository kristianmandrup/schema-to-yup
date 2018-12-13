const { YupBaseType } = require("./base-type");

function toYupMixed(obj, config = {}) {
  return obj && YupMixed.create(obj).createSchemaEntry();
}

class YupMixed extends YupBaseType {
  constructor(obj) {
    super(obj);
    this.base = this.yup.mixed();
  }

  static create(obj) {
    return new YupMixed(obj);
  }

  get allEnabled() {
    return [...this.baseEnabled, ...this.enabled];
  }

  convert() {
    this.normalize();
    this.addMappedConstraintsFor(this.baseConstraintsMap);
    return this;
  }

  get baseEnabled() {
    return ["required", "notRequired", "nullable", "default", "strict"];
  }

  get baseConstraintsMap() {
    return {
      on: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }

  get baseAliasMap() {
    return {
      oneOf: ["enum"],
      notOneOf: ["not"]
    };
  }
}

module.exports = {
  YupMixed,
  toYupMixed
  // ConvertYupSchemaError
};
