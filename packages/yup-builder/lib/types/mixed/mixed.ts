import { TypeSchemaEntry } from "../base/type-schema-entry";


export class MixedSchemaEntry extends TypeSchemaEntry {
  enabled: any;

  constructor(obj) {
    super(obj);
  }

  static schemaEntryFor(obj: any): any {
    return {};
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
