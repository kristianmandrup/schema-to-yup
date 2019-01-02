import { YupMixed } from './mixed';

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

class YupString extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "string";
    this.base = this.yup.string();
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
    this.url();
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

  // todo: use NumericConstraint or RangeConstraint
  minLength() {
    const { minLength } = this.constraints;
    const errMsg = this.valErrMessage("minLength") || this.valErrMessage("min");
    const newBase = minLength && this.base.min(minLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  // todo: use NumericConstraint or RangeConstraint
  maxLength() {
    const { maxLength } = this.constraints;
    const errMsg = this.valErrMessage("maxLength") || this.valErrMessage("max");
    const newBase = maxLength && this.base.max(maxLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  pattern() {
    const { pattern } = this.constraints;
    if (!pattern) {
      return this;
    }
    const regex = new RegExp(pattern);
    const errMsg =
      this.valErrMessage("pattern") ||
      this.valErrMessage("matches") ||
      this.valErrMessage("regex");

    const newBase = regex && this.base.matches(regex, errMsg);
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

export {
  toYupString,
  YupString,
  StringHandler
};
