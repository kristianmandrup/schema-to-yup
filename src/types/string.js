const { YupMixed } = require("./mixed");

class StringHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isString(obj);
  }

  handle(obj) {
    return (
      this.isString(obj) &&
      YupString.create({ config: this.config, ...obj }).createSchemaEntry()
    );
  }
}

function toYupString(obj, config = {}) {
  return obj && new StringHandler(config).handle(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
class YupString extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "string";
    this.base = this.yup.string();
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
  YupString,
  StringHandler
};
