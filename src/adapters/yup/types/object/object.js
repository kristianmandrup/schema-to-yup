import { ObjectType as BaseObjectType } from "../base";
import { constraints } from "./constraints";

export class ObjectType extends BaseObjectType {
  static create(obj, config) {
    return new ObjectType(obj, config);
  }

  get constraintNames() {
    return ["camelCase", "constantCase"];
  }

  get constraintsToApply() {
    return ["noUnknown"];
  }

  get defaultConstraints() {
    return constraints;
  }

  // move to base
  applyConstraints() {
    this.constraintsToApply.map(name => this.constraints[name]());
  }

  get constraints() {
    return {
      ...this.defaultConstraints,
      ...this.customConstraints
    };
  }

  get customConstraints() {
    return this.constraintsFor(this.type);
  }
}
