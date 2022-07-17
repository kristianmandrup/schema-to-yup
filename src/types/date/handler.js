import { YupDate } from "./date";

export class DateHandler {
  constructor(config) {
    this.config = config;
  }

  isDate(obj) {
    return this.config.isDate(obj);
  }

  isDateCompatible(obj) {
    return this.config.isString(obj);
  }

  handle(obj) {
    return YupDate.create(obj).createSchemaEntry();
    // return this.isDate(obj) && YupDate.create(obj).createSchemaEntry();
    // return this.isDateCompatible(obj) && YupDate.create(obj).createSchemaEntry();    
  }
}
