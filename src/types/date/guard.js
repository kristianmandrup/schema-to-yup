const { Guard } = require("../_guard");

class DateGuard extends Guard {
  constructor(config) {
    this.config = config;
  }

  isValid(obj) {
    return this.config.isDate(obj);
  }
}

function createDateGuard(obj, config) {
  return new DateGuard(obj, config);
}

module.exports = {
  createDateGuard,
  DateGuard
};
