import { ObjectType as BaseObjectType } from "../base";
import { constraints } from "./constraints";

export class ObjectType extends BaseObjectType {
  static create(obj, config) {
    return new ObjectType(obj, config);
  }

  get constraintNames() {
    return ["camelCase", "constantCase"];
  }

  noUnknown() {
    const clazz = constraints["noUnknown"];
    new clazz(this).apply();
  }
}
