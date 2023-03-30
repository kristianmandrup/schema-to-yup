import { YupMixed } from "../mixed";

export class YupString extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.baseType;
    this.base = this.validatorInstance;
  }

  get baseType() {
    return "string";
  }

  get validatorInstance() {
    return this.validator.string();
  }

  static create(obj) {
    return new YupString(obj);
  }

  convert() {
    super.convert();
    return this;
  }

  get typeEnabled() {
    return [
      "normalize",
      "trim",
      "minLength",
      "maxLength",
      "pattern",
      "lowercase",
      "uppercase",
      "email",
      "url",
      "genericFormat",
    ];
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
    if (this.validator.prototype[format]) {
      this.addConstraint(this.format);
    }
  }

  email() {
    if (!this.isEmail) return this;
    const constraintName = this.constraintNameFor("email", "format");
    const method = "email";
    this.addConstraint("email", {
      constraintValue: true,
      constraintName,
      method,
      errName: method,
    });
    return this;
  }

  constraintNameFor(...names) {
    return names.find((name) => this.constraints[name]);
  }

  get isEmail() {
    return this.constraints.email || this.format === "email";
  }

  url() {
    if (!this.isUrl) return this;
    const constraintName = this.constraintNameFor("url", "format");
    const method = "url";
    this.addConstraint("url", {
      constraintValue: true,
      constraintName,
      method,
      errName: method,
    });
    return this;
  }

  get isUrl() {
    return this.constraints.url || this.format === "url";
  }

  // todo: use NumericConstraint or RangeConstraint
  minLength() {
    const { minLength } = this.constraints;
    const errMsg =
      this.validationErrorMessage("minLength") ||
      this.validationErrorMessage("min");
    const newBase = minLength && this.base.min(minLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  // todo: use NumericConstraint or RangeConstraint
  maxLength() {
    const { maxLength } = this.constraints;
    const errMsg =
      this.validationErrorMessage("maxLength") ||
      this.validationErrorMessage("max");
    const newBase = maxLength && this.base.max(maxLength, errMsg);
    this.base = newBase || this.base;
    return this;
  }

  pattern() {
    const { pattern, flags, excludeEmptyString } = this.constraints;
    if (!pattern) {
      return this;
    }
    const regex = new RegExp(pattern, flags);
    const errMsg =
      this.validationErrorMessage("pattern") ||
      this.validationErrorMessage("matches") ||
      this.validationErrorMessage("regex");

    const newBase =
      regex &&
      this.base.matches(regex, { message: errMsg, excludeEmptyString });
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
