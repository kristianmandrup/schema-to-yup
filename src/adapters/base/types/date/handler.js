import { YupDate } from "./date";

export class DateHandler {
  constructor(config) {
    this.config = config;
  }

  isDate(obj) {
    return this.config.isDate(obj);
  }

  handle(obj) {
    return this.isDate(obj) && YupDate.create(obj).createSchemaEntry();
  }
}
