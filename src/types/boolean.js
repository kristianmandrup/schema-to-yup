const { YupMixed } = require("./mixed");

class BooleanHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isBoolean(obj);
  }

  handle(obj) {
    return this.isBoolean(obj) && YupString.create(obj).yupped();
  }
}

function toYupBoolean(obj, config = {}) {
  return new BooleanHandler(config).handle(obj);
}

class YupBoolean extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "boolean";
    this.base = this.yup[this.type]();
  }

  static create(obj) {
    return new YupBoolean(obj);
  }
}

module.exports = {
  toYupBoolean,
  YupBoolean
};
