import { Guard } from "../base/guard";
import { BooleanSchemaEntry } from "./boolean";

export class BooleanGuard extends Guard {
  constructor(obj, config) {
    super(obj, config);
  }

  isValid() {
    return this.config.isBoolean(this.obj);
  }
}

export function createBooleanGuard(obj, config = {}) {
  return new BooleanGuard(obj, config);
}
