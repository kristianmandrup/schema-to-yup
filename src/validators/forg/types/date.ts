import { GenericSchemaEntry } from "./generic";

export class DateSchemaEntry extends GenericSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "date";
  }
}
