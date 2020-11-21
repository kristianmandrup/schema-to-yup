import { YupBaseType } from "../base-type";

// Allow recursive schema
export class YupObject extends YupBaseType {
  constructor(obj) {
    super(obj);
    this.type = "object";
    this.base = this.yup.object();
    this.properties = this.value.properties;
  }

  static create(obj) {
    return new YupObject(obj);
  }

  get typeEnabled() {
    return ["noUnknown", "camelCase", "constantCase"];
  }

  convert() {
    if (!this.properties) return this;

    super.convert();
    return this;
  }
}
