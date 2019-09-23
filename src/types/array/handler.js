import { YupArray } from "./array";
import { Base } from "../base";

export class ArrayHandler extends Base {
  constructor(config) {
    super(config);
  }

  isArray(obj) {
    if (!this.config.isArray) {
      this.error("ArrayHandler: mising isArray in config", this.config);
    }
    return this.config.isArray(obj);
  }

  handle(obj) {
    return this.isArray(obj) && YupArray.create(obj).createSchemaEntry();
  }
}
