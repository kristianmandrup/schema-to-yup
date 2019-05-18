import { Guard } from "../base/guard";

export class ArrayGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isValid() {
    return this.config.isArray(this.obj);
  }
}

export function createArrayGuard(obj, config) {
  return new ArrayGuard(obj, config);
}
