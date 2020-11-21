import { typeMatcher } from "../../types/_type-matcher";
const { isObjectType, isStringType } = typeMatcher
import { createWhenEntry } from "./when-entry";

class WhenCondition {
  constructor(opts = {}) {
    const { type, key, value, when, schema, properties, config } = opts;
    this.opts = opts;
    this.when = when;
    this.key = key;
    this.type = type;
    this.value = value;
    this.schema = schema;
    this.properties = properties;
    this.config = config;
    this.validate();
  }

  validate() {
    if (!isStringType(this.type)) {
      this.error(`validate: invalid or mising type: ${this.type}`, this.opts);
    }

    if (!isObjectType(this.when)) {
      this.error(`validate: invalid or mising when: ${this.when}`, this.opts);
    }
  }

  validateAndConfigure(when) {
    when = when || this.when;
    if (!isObjectType(when)) {
      this.warn("invalid or missing when constraint", when);
      return false;
    }

    const whenKeys = Object.keys(when);

    if (whenKeys.length < 1) {
      this.warn(`when constraint must have at least 1 key: ${whenKeys}`, when);
      return false;
    }

    this.whenKeys = whenKeys;
    return true;
  }

  createWhenEntry(whenEntryObj, opts) {
    return createWhenEntry(whenEntryObj, opts);
  }

  accumulate(acc, key) {
    // clone
    let whenEntryObj = this.when[key];

    if (!isObjectType(whenEntryObj)) {
      this.warn(
        `invalid when entry constraint object ${whenEntryObj} for ${key}`
      );
      return acc;
    }

    // const keys = Object.keys(whenEntryObj);

    const opts = {
      // keys,
      type: this.type,
      key: this.key,
      schema: this.schema,
      properties: this.properties,
      config: this.config
    };

    const { entryObj } = this.createWhenEntry(whenEntryObj, opts);
    if (!entryObj) return acc;

    acc = Object.assign(acc, entryObj);
    return acc;
  }

  get constraintObj() {
    if (!this.whenKeys) return {};
    return this.whenKeys.reduce(this.accumulate.bind(this), {});
  }

  get keyVal() {
    const keys = this.whenKeys || [];
    return keys.length === 1 ? keys[0] : keys;
  }

  get constraintValue() {
    return this.keyVal ? [this.keyVal, this.constraintObj] : false;
  }

  get constraint() {
    return this.validateAndConfigure() && this.constraintValue;
  }

  warn(msg, value) {
    console.error("[WhenCondition] WARNING", msg, value);
  }

  error(msg, value) {
    console.error("[WhenCondition] ERROR", msg, value);
    throw msg;
  }
}

const createWhenCondition = opts => {
  return new WhenCondition(opts);
};

export { WhenCondition, createWhenCondition };
