import { ObjectType as BaseObjectType } from "./base";

export class ObjectType extends BaseObjectType {
  static create(obj, config) {
    return new ObjectType(obj, config);
  }

  get constraints() {
    return ["camelCase", "constantCase"];
  }

  applyConstraints() {
    this.constraints.map(name => this.addConstraint(name));
  }

  noUnknown() {
    const { noUnknown, propertyNames } = this.value;
    const names = noUnknown || propertyNames;

    if (!names) return this;

    const typeInstance = this.typeInstance.noUnknown(names);

    typeInstance || this.applyMatchingErrMsg("noUnknown", "propertyNames");

    this.applyToTypeInstance(typeInstance);
    return this;
  }
}
