const { YupMixed } = require("./mixed");

class BooleanHandler {
  constructor(config) {
    this.config = config;
  }

  isBoolean(obj) {
    return this.config.isBoolean(obj);
  }

  handle(obj) {
    return this.isBoolean(obj) && YupBoolean.create(obj).createSchemaEntry();
  }
}

function toYupBoolean(obj, config = {}) {
  return obj && new BooleanHandler(config).handle(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
class YupBoolean extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "boolean";
    this.validatorTypeApi = this.yup.boolean();
  }

  static create(obj) {
    return new YupBoolean(obj);
  }
}

module.exports = {
  toYupBoolean,
  YupBoolean
};
