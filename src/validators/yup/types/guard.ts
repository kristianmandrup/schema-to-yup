import { Base } from "../../../base";
import { ObjectDef } from "../../../_types";

export class Guard extends Base {
  config: ObjectDef = {};
  obj: any;
  constructor(obj, config) {
    super(config);
    this.obj = obj;
  }

  isValid() {
    return false;
  }

  verify() {
    return this.isPresent(this.obj) && this.isValid();
  }
}
