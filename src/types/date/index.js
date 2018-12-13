const { YupMixed } = require("../mixed");
const { DateGuard, createDateGuard } = require("./guard");

const proceed = (obj, config = {}) => {
  return createDateGuard(obj, config).verify();
};

function toYupDate(obj, config = {}) {
  return proceed(obj, config) && buildYupDate(obj);
}

function toYupDateSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

function buildSchemaEntry(obj) {
  return YupDate.schemaEntryFor(obj);
}

function buildYupDate(obj) {
  return YupDate.create(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
class YupDate extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "date";
    this.base = this.yup.date();
  }

  static create(obj) {
    return new YupDate(obj);
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

module.exports = {
  toYupDate,
  toYupDateSchemaEntry,
  YupDate,
  DateGuard,
  createDateGuard
};
