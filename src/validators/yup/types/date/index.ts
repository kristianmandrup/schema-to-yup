import { MixedSchemaEntry } from "../mixed";
import { DateGuard, createDateGuard } from "./guard";

const proceed = (obj, config = {}) => {
  return createDateGuard(obj, config).verify();
};

export function toSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && createSchemaEntry(obj);
}

export function toDateSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

export function buildSchemaEntry(obj) {
  return DateSchemaEntry.schemaEntryFor(obj);
}

export function createSchemaEntry(obj) {
  return DateSchemaEntry.create(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
class DateSchemaEntry extends MixedSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "date";
    // this.validatorTypeApi = this.yup.date();
  }

  static create(obj) {
    return new DateSchemaEntry(obj);
  }

  static schemaEntryFor(obj) {
    return DateSchemaEntry.create(obj).convert();
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
