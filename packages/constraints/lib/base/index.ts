import { ObjectDef } from "./_types";
import { Loggable, inquiry, util } from "@schema-validator/core";
export { ObjectDef, Loggable, util };
const defaults = inquiry;

export class Base extends Loggable {
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
