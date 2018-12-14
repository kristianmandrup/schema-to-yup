const { Guard } = require("../_guard");

class ArrayGuard extends Guard {
  constructor(config) {
    super(config);
  }

  isValid(obj) {
    return this.config.isArray(obj);
  }
}

function createArrayGuard(obj, config) {
  return new ArrayGuard(obj, config);
}

module.exports = {
  createArrayGuard,
  ArrayGuard
};
