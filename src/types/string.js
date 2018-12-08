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

  email() {
    this.isEmail && this.addConstraint("email");
    return this;
  }

  get isEmail() {
    return this.value.email || this.format === "email";
  }

  url() {
    this.isUrl && this.addConstraint("url");
    return this;
  }

  get isUrl() {
    return this.value.url || this.format === "url";
  }

  minLength() {
    const newBase =
      this.value.minLength &&
      this.base.min(
        this.value.minLength,
        this.valErrMessage("minLength") || this.valErrMessage("min")
      );
    this.base = newBase || this.base;
    return this;
  }

  maxLength() {
    const newBase =
      this.value.maxLength &&
      this.base.min(
        this.value.maxLength,
        this.valErrMessage("maxLength") || this.valErrMessage("max")
      );
    this.base = newBase || this.base;
    return this;
  }

  pattern() {
    if (this.value.pattern) {
      this.regex = new RegExp(this.value.pattern);
    }
    const newBase =
      this.value.pattern &&
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
    this.value.pattern =
      this.value.pattern || this.value.matches || this.value.regex;
    this.value.maxLength = this.value.maxLength || this.value.max;
    this.value.minLength = this.value.minLength || this.value.min;
  }
}

module.exports = {
  toYupString,
  YupString,
  StringHandler
};
