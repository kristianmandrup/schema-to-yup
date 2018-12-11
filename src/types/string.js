const { YupMixed } = require("./mixed");

class StringHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isString(obj);
  }

  handle(obj) {
    return this.isString(obj) && YupString.create(obj).yupped();
  }
}

function toYupString(obj, config = {}) {
  return new StringHandler(config).handle(obj);
}

class YupString extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "string";
    this.base = this.yup[this.type]();
  }

  static create(obj) {
    return new YupString(obj);
  }

  convert() {
    super.convert();
    this.normalize();
    this.minLength()
      .maxLength()
      .pattern();
    this.lowercase().uppercase();
    this.email();
    this.genericFormat();
    return this;
  }

  trim() {
    return this.addConstraint("trim");
  }

  lowercase() {
    return this.addConstraint("lowercase");
  }

  uppercase() {
    return this.addConstraint("uppercase");
  }

  genericFormat() {
    if (!this.config.format === true) return;
    const format = this.format;
    if (this.yup.prototype[format]) {
      this.addConstraint(this.format);
    }
  }

  email() {
    this.isEmail && this.addConstraint("email");
    return this;
  }

  get isEmail() {
    return this.constraints.email || this.format === "email";
  }

  url() {
    this.isUrl && this.addConstraint("url");
    return this;
  }

  get isUrl() {
    return this.constraints.url || this.format === "url";
  }

  minLength() {
    const newBase =
      this.constraints.minLength &&
      this.base.min(
        this.constraints.minLength,
        this.valErrMessage("minLength") || this.valErrMessage("min")
      );
    this.base = newBase || this.base;
    return this;
  }

  maxLength() {
    const newBase =
      this.constraints.maxLength &&
      this.base.min(
        this.constraints.maxLength,
        this.valErrMessage("maxLength") || this.valErrMessage("max")
      );
    this.base = newBase || this.base;
    return this;
  }

  pattern() {
    if (this.constraints.pattern) {
      this.regex = new RegExp(this.constraints.pattern);
    }
    const newBase =
      this.constraints.pattern &&
      this.base.matches(
        this.regex,
        this.valErrMessage("pattern") ||
          this.valErrMessage("matches") ||
          this.valErrMessage("regex")
      );
    this.base = newBase || this.base;
    return this;
  }

  normalize() {
    this.constraints.pattern =
      this.constraints.pattern ||
      this.constraints.matches ||
      this.constraints.regex;
    this.constraints.maxLength =
      this.constraints.maxLength || this.constraints.max;
    this.constraints.minLength =
      this.constraints.minLength || this.constraints.min;
  }
}

module.exports = {
  toYupString,
  YupString,
  StringHandler
};
