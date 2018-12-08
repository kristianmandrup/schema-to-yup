const { YupMixed } = require("./mixed");

const { buildYup } = require("../");

class ObjectHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isObject(obj);
  }

  handle(obj) {
    return this.isObject(obj) && YupString.create(obj).yupped();
  }
}

function toYupObject(obj, config = {}) {
  return new ObjectHandler(config).handle(obj);
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
  YupObject,
  ObjectHandler
};
