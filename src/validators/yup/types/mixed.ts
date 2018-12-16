import { BaseType } from "./base-type";

export function toSchemaEntry(obj, config = {}) {
  return obj && MixedSchemaEntry.create(obj).createSchemaEntry();
}

export class MixedSchemaEntry extends BaseType {
  enabled: any;

  constructor(obj) {
    super(obj);
  }

  static create(obj) {
    return new MixedSchemaEntry(obj);
  }

  get allEnabled() {
    return [...this.baseEnabled, ...this.enabled];
  }

  convert() {
    this.normalize();
    this.addMappedConstraintsFor(this.baseConstraintsMap);
    return this;
  }

  addConstraint(_: any) {
    return this;
  }

  addMappedConstraints() {}

  addMappedConstraintsFor(map: any) {}

  get baseEnabled() {
    return ["required", "notRequired", "nullable", "default", "strict"];
  }

  get baseConstraintsMap() {
    return {
      on: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }

  get baseAliasMap() {
    return {
      oneOf: ["enum"],
      notOneOf: ["not"]
    };
  }
}
