import { Guard } from "../guard";

export class DateGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isValid() {
    return this.config.isDate(this.obj);
  }
}

export function createDateGuard(obj, config) {
  return new DateGuard(obj, config);
}
