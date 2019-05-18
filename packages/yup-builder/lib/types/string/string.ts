import { MixedSchemaEntry } from "../mixed/mixed";

export class StringSchemaEntry extends MixedSchemaEntry {
  constructor(obj) {
    super(obj);
    this.type = "string";
  }

  static schemaEntryFor(obj) {
    return new StringSchemaEntry(obj);
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
    this.addConstraint(format);
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
