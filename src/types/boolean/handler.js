import { YupBoolean } from "./boolean";

export class BooleanHandler {
  constructor(config) {
    this.config = config;
  }

  isBoolean(obj) {
    return this.config.isBoolean(obj);
  }

  handle(obj) {
    return this.isBoolean(obj) && YupBoolean.create(obj).createSchemaEntry();
  }
}
