import { Guard } from "../guard";

export class ObjectGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isValid(): boolean {
    return this.config.isObject(this.obj);
  }
}

export function createObjectGuard(obj, config) {
  return new ObjectGuard(obj, config);
}
