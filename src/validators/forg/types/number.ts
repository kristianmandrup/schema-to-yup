import { GenericSchemaEntry } from "./generic";

export class NumberSchemaEntry extends GenericSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = this.normalizeNumType(obj.type);
  }

  normalizeNumType(type) {
    return type === "int" ? "integer" : type;
  }

  min(length: number = 0) {
    this.addRuleOpt({
      min: length
    });
  }

  max(length: number = 9999) {
    this.addRuleOpt({
      max: length
    });
  }
}
