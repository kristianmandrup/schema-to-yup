import defaults from './defaults';
import { createYupSchemaEntry } from '../create-entry';
import { TypeMatcher } from './_type-matcher';

class Base extends TypeMatcher {
  constructor(config = {}) {
    super(config);
    config = {
      createYupSchemaEntry,
      ...config
    };
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }
}

export {
  Base
};
