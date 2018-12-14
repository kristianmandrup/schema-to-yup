const { Guard } = require("../_guard");

class StringGuard extends Guard {
  constructor(config) {
    this.config = config;
  }

  isValid(obj) {
    return this.config.isString(obj);
  }
}

function createStringGuard(obj, config) {
  return new StringGuard(obj, config);
}

module.exports = {
  createStringGuard,
  StringGuard
};
