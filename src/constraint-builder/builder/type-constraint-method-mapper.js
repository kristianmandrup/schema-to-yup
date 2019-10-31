import { ConstraintMapper } from "../../adapters/yup";

export class TypeConstraintMethodMapper {
  get aliasMap() {
    return {
      ...this.mixedAliasMap
      // TODO: override on individual type class to add more type specific aliases
    };
  }

  methodNameFor(name) {
    name = this.aliasMap[name] || name;
    if (this.isNothing(name) || name === "") {
      this.error("Invalid yup contraint method name", name);
    }
    return name;
  }
}
