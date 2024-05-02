import { YupNull } from "./null";

export class NullHandler {
  constructor(config) {
    this.config = config;
  }

  isBoolean(obj) {
    return this.config.isNull(obj);
  }

  handle(obj) {
    return this.isNull(obj) && YupNull.create(obj).createSchemaEntry();
  }
}
