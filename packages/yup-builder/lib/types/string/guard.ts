import { Guard } from "../guard";

export class StringGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isValid() {
    return this.config.isString(this.obj);
  }
}

export function createStringGuard(obj, config) {
  return new StringGuard(obj, config);
}
