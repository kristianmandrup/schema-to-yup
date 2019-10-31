import { BaseType as BasicType } from "../base";

export class BaseType extends BasicType {
  constructor(opts = {}, config) {
    super(opts.config || config);
  }

  get constraintsMap() {
    return {
      simple: ["required", "notRequired", "nullable"],
      value: ["default", "strict"]
    };
  }

  get typeInst() {
    return this.yup[this.type]();
  }

  convert() {
    this.oneOf();
    this.notOneOf();
    this.nullable();
    this.isType();
    this.when();
    return this;
  }

  oneOf() {
    let values =
      this.constraints.enum || this.constraints.oneOf || this.constraints.anyOf;
    if (this.isNothing(values)) return this;
    values = Array.isArray(values) ? values : [values];
    // using alias
    const alias = ["oneOf", "enum", "anyOf"].find(key => {
      return this.constraints[key];
    });

    return this.addConstraint(alias, { values });
  }

  notOneOf() {
    const { not, notOneOf } = this.constraints;
    let values = notOneOf || (not && (not.enum || not.oneOf));
    if (this.isNothing(values)) return this;
    values = Array.isArray(values) ? values : [values];

    return this.addConstraint("notOneOf", { values });
  }

  isType() {
    const value = this.constraints.isType;
    this.addConstraint("isType", { value, errName: "notOneOf" });
    return this;
  }

  nullable() {
    const { nullable, isNullable } = this.constraints;
    const value = nullable || isNullable;
    this.addConstraint("nullable", { value, errName: "notOneOf" });
    return this;
  }
}
