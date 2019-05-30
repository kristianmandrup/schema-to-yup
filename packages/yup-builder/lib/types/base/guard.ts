import { Loggable, util, ObjectDef } from "@schema-validator/core";
const { isPresent } = util;

export class Guard extends Loggable {
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
    return isPresent(this.obj) && this.isValid();
  }
}
