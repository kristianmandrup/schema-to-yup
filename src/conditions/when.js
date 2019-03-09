// import { YupSchemaEntry } from "../entry";

function isObjectType(obj) {
  return obj === Object(obj);
}

function isStringType(val) {
  return typeof val === "string";
}

class WhenCondition {
  constructor(opts = {}) {
    const { type, key, value, when, schema, properties, config } = opts;
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
      this.error(`invalid or mising type: ${type}`);
    }

    if (!isObjectType(this.when)) {
      this.error(`invalid or mising when: ${when}`);
    }
  }

  keysArePresent(keys) {
    const properties = this.properties;
    return keys.every(key => properties[key] !== undefined);
  }

  createValue(entryObj, key) {
    if (typeof entryObj === "string") {
      entryObj = {
        [entryObj]: true
      };
    }
    if (!isObjectType(entryObj)) {
      this.error(`${key}: must be a schema object`);
    }
    return {
      key: this.key,
      type: this.type,
      ...entryObj
    };
  }

  createEntryOpts(entryObj, whenKey) {
    // recursive apply then object
    const value = this.createValue(entryObj, whenKey);
    return {
      schema: this.schema,
      properties: this.properties,
      key: this.key,
      type: this.type,
      value,
      config: this.config
    };
  }

  createYupSchemaEntry(opts) {
    return this.config.createYupSchemaEntry(opts);
  }

  createEntry(entryObj, whenKey) {
    const opts = this.createEntryOpts(entryObj, whenKey);
    return this.createYupSchemaEntry(opts);
  }

  hasKey(keys, findKey) {
    return keys.find(key => key === findKey);
  }

  validateAndConfigure(when) {
    when = when || this.when;
    if (!isObjectType(when)) return false;

    const whenKeys = Object.keys(when);

    if (whenKeys.length < 2) return false;

    // must have is condition
    if (!this.hasKey(whenKeys, "is")) return false;

    // must have then condition
    if (!this.hasKey(whenKeys, "then")) return false;

    this.whenKeys = whenKeys;
    this.whenKeysPresent = this.keysArePresent(this.whenKeys);

    return true;
  }

  checkIs(is, present) {
    present = present || this.whenKeysPresent;
    return (is === true && present) || (is === false && !present);
  }

  whenEntryFor(whenObj, key) {
    const entryDef = whenObj[key];
    if (!entryDef) return whenObj;
    whenObj = this.createEntry(entryDef, "then");
    return whenObj;
  }

  accumulate(acc, key) {
    // clone
    let whenObj = this.when[key];
    if (!isObjectType(whenObj)) {
      this.warn(`invalid when constraint ${whenObj} for ${key}`);
      return acc;
    }

    const { is } = whenObj;

    if (!this.checkIs(is)) return acc;

    whenObj = this.whenEntryFor(whenObj, "then");
    whenObj = this.whenEntryFor(whenObj, "otherwise");

    acc = Object.assign(acc, whenObj);
    return acc;
  }

  get constraintObj() {
    if (!this.whenKeys) return {};
    return this.whenKeys.reduce(this.accumulate.bind(this), {});
  }

  get keyVal() {
    const keys = this.keys || [];
    return keys.length === 1 ? keys[0] : keys;
  }

  get constraintValue() {
    return this.keyVal ? [this.keyVal, this.constraintObj] : false;
  }

  get constraint() {
    return this.validateAndConfigure() && constraintValue;
  }

  warn(msg) {
    console.error("WARNING", msg);
  }

  error(msg) {
    console.error("ERROR", msg);
    throw msg;
  }
}

const createWhenCondition = opts => {
  return new WhenCondition(opts);
};

export { WhenCondition, createWhenCondition };
