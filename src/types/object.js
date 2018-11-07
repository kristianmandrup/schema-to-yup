const { YupMixed } = require("./mixed");

const { buildYup } = require("../");

function isObjectType(obj) {
  return obj === Object(obj);
}

function isObject(obj) {
  return obj.type === "object"; // && isObjectType(obj.properties)
}

function toYupObject(obj) {
  return isObject(obj) && YupObject.create(obj).yupped();
}

// Allow recursive schema
class YupObject extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "object";
    this.base = this.yup[this.type]();
    this.properties = this.value.properties;
  }

  convert() {
    if (!this.properties) return;
    this.noUnknown();
    this.camelCase().constantCase();

    // recursive definition
    if (this.value) {
      const schema = buildYup(this.value);
      this.base.shape(schema);
    }
  }

  camelCase() {
    return this.addConstraint("camelCase");
  }

  constantCase() {
    return this.addConstraint("constantCase");
  }

  noUnknown() {
    const { noUnknown, propertyNames } = this.value;
    const $names = noUnknown || propertyNames;
    const newBase =
      $names &&
      this.base.noUnknown(
        $names,
        this.valErrMessage("propertyNames") || this.valErrMessage("noUnknown")
      );
    this.base = newBase || this.base;
    return this;
  }
}

module.exports = {
  toYupObject,
  YupObject
};
