import { MixedSchemaEntry } from "../mixed";

export class DateSchemaEntry extends MixedSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "date";
  }

  static create(obj) {
    return new DateSchemaEntry(obj);
  }

  get constraintsTypeMap() {
    return {
      dateRange: "date",
      minDate: "date",
      maxDate: "date"
    };
  }

  get constraintsMap() {
    return {
      dateRange: ["minDate", "maxDate"]
    };
  }

  get aliasMap() {
    return {
      minDate: ["min"],
      maxDate: ["max"]
    };
  }
}
