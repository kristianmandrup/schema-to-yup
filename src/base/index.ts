import { defaults } from "../defaults";
import { TypeMatcher } from "./type-matcher";
import { ObjectDef } from "../common/_types";

export class Base extends TypeMatcher {
  config: ObjectDef;

  constructor(config: ObjectDef = {}) {
    super(config);
    config = {
      ...config
    };
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }
}
