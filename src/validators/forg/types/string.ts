import { GenericSchemaEntry } from "./generic";

export class StringSchemaEntry extends GenericSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "string";
  }

  minLength(length: number = 0) {
    this.addRuleOpt({
      minLength: length
    });
  }

  maxLength(length: number = 255) {
    this.addRuleOpt({
      maxLength: length
    });
  }
}
