import { YupString } from "./string";

export class StringHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isString(obj);
  }

  handle(obj) {
    return (
      this.isString(obj) &&
      YupString.create({ config: this.config, ...obj }).createSchemaEntry()
    );
  }
}
