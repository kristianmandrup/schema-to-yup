const { YupMixed } = require("../mixed");
const { createStringGuard, StringGuard } = require("./guard");

const proceed = (obj, config = {}) => {
  return createStringGuard(obj, config).verify();
};

function toYupString(obj, config = {}) {
  return proceed(obj, config) && buildYupString(obj);
}

function toYupStringSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

function buildSchemaEntry(obj) {
  return YupString.schemaEntryFor(obj);
}

function buildYupString(obj) {
  return YupString.create(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
class YupString extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "string";
    this.validatorTypeApi = this.yup.string();
  }

  static create(obj) {
    return new YupString(obj);
  }

  get enabled() {
    return [
      "lengthRange",
      "pattern",
      "cased",
      "email",
      "url",
      "genericFormat",
      "trim"
    ];
  }

  get constraintsMap() {
    return {
      on: ["trim", "cased", "email", "url"],
      value: ["matches", "lengthRange"]
    };
  }

  get grouped() {
    return {
      cased: ["lowercase", "uppercase"],
      lengthRange: ["minLength", "maxLength"]
    };
  }

  get constraintsTypeMap() {
    return {
      pattern: "regexp",
      lengthRange: "numeric",
      minLength: "numeric",
      maxLength: "numeric"
    };
  }

  get constraintsFormats() {
    return {
      email: "email",
      url: "url"
    };
  }

  convert() {
    super.convert();
    this.addMappedConstraints();
    this.genericFormat();
    return this;
  }

  genericFormat() {
    if (!this.config.format === true) return;
    const format = this.format;
    if (this.yup.prototype[format]) {
      this.addConstraint(this.format);
    }
  }

  // for normalize
  get aliasMap() {
    return {
      matches: ["pattern", "regexp"],
      maxLength: ["max"],
      minLength: ["min"]
    };
  }
}

module.exports = {
  toYupString,
  toYupStringSchemaEntry,
  YupString,
  StringGuard,
  createStringGuard
};
