import { BaseType } from "../base";

// Allow recursive schema
export class ObjectType extends BaseType {
  constructor(obj) {
    super(obj);
    this.type = "object";
    this.properties = this.value.properties;
  }
}
