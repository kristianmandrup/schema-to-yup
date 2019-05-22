import { TypeMatcher, ObjectDef } from "@schema-validator/core";

export class Guard extends TypeMatcher {
  config: ObjectDef = {};
  obj: any;
  constructor(obj, config) {
    super(config);
    this.obj = obj;
  }

  isValid(): boolean {
    return false;
  }

  verify() {
    return this.isPresent(this.obj) && this.isValid();
  }
}
