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

  get constraintsMap() {
    return {
      on: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }

  oneOf() {
    const value = this.constraints.enum || this.constraints.oneOf;
    return this.addConstraint("oneOf", { value, errName: "enum" });
  }

  notOneOf() {
    const { not, notOneOf } = this.constraints;
    const value = notOneOf || (not && (not.enum || not.oneOf));
    return this.addConstraint("notOneOf", { value });
  }

  $const() {
    return this;
  }

  // boolean https: //ajv.js.org/keywords.html#allof
  $allOf() {
    return this;
  }

  // https://ajv.js.org/keywords.html#anyof
  $anyOf() {
    return this;
  }

  // https: //ajv.js.org/keywords.html#oneof
  $oneOf() {
    return this;
  }

  // conditions https://ajv.js.org/keywords.html#not
  $not() {
    return this;
  }

  $if() {
    return this;
  }

  $then() {
    return this;
  }

  $else() {
    return this;
  }
}

module.exports = {
  YupMixed,
  toYupMixed
  // ConvertYupSchemaError
};
