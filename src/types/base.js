import defaults from "./defaults";
// import { createYupSchemaEntry } from '../create-entry';
import { TypeMatcher } from "./_type-matcher";

class Base extends TypeMatcher {
  constructor(config = {}) {
    super(config);
    const schemaType = config.schemaType || "json-schema";
    const _defaults = config.schemaParserMap || defaults
    const $defaults = _defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }
}

export { Base };
