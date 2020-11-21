import { YupMixed } from "../mixed";

export class YupString extends YupMixed {
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
    return this;
  }

  get typeEnabled() {
    return [
      "normalize",
      "minLength",
      "maxLength",
      "pattern",
      "lowercase",
      "uppercase",
      "email",
      "url",
      "genericFormat"
    ];
  }
  
  
  constraintNameFor(...names) {
    return names.find(name => this.constraints[name]);
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
