import { GenericSchemaEntry } from "./generic";

export class ArraySchemaEntry extends GenericSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "array";
  }
}
