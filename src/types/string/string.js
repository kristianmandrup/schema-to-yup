import { YupBaseType } from "../base-type";

export class YupString extends YupBaseType {
  constructor(obj) {
    super(obj);    
  }

  get yupType() {
    return 'string'
  }

  static create(obj) {
    return new YupString(obj);
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
      "format"
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
