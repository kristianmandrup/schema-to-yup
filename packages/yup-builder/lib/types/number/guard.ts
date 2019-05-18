import { Guard } from "../base/guard";

export class NumberGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isValid() {
    return this.config.isNumber(this.obj);
  }
}

export function createNumberGuard(obj, config = {}) {
  return new NumberGuard(obj, config);
}
