import { Guard } from "../guard";

class DateGuard extends Guard {
  config: any;

  constructor(obj: any, config = {}) {
    super(obj, config);
  }

  isValid(): boolean {
    return this.config.isDate(this.obj);
  }
}

function createDateGuard(obj, config) {
  return new DateGuard(obj, config);
}

module.exports = {
  createDateGuard,
  DateGuard
};
