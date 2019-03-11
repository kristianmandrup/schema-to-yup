function isObjectType(obj) {
  return obj === Object(obj);
}

function isStringType(val) {
  return typeof val === "string";
}

export class WhenEntry {
  constructor(whenEntryObj, opts = {}) {
    this.whenEntryObj = whenEntryObj;
    const { schema, properties, config, key, keys, when, type } = opts;
    this.schema = schema;
    this.when = when;
    this.properties = properties || {};
    this.key = key;
    // this.whenKeys = (when ? Object.keys(when) : keys) || [];
    this.type = type;
    this.config = config;
  }

  // keysArePresent(keys) {
  //   const whenKeys = this.whenKeys;
  //   return keys.every(key => !!whenKeys.includes(key));
  // }

  validateAndConfigure(whenEntryObj) {
    whenEntryObj = whenEntryObj || this.whenEntryObj;
    if (!isObjectType(whenEntryObj)) {
      this.warn(
        "invalid or missing when entry constraint object",
        whenEntryObj
      );
      return false;
    }

    const whenEntryKeys = Object.keys(whenEntryObj);

    if (whenEntryKeys.length < 2) {
      this.warn(
        `validateAndConfigure: when entry constraint must have at least 2 keys: ${whenEntryKeys}`,
        whenEntryObj
      );
      return false;
    }

    // must have is condition
    if (!this.hasKey(whenEntryKeys, "is")) {
      this.warn(
        `validateAndConfigure: when entry constraint missing 'is' constraint: ${whenEntryKeys}`,
        whenEntryObj
      );
      return false;
    }

    // must have then condition
    if (!this.hasKey(whenEntryKeys, "then")) {
      this.warn(
        `validateAndConfigure: when entry constraint missing 'then' or 'else' constraint: ${whenEntryKeys}`,
        whenEntryObj
      );
      return false;
    }

    // this.whenEntryKeys = this.keys || [];
    // this.whenEntryKeysPresent = this.keysArePresent(this.whenEntryKeys);

    return true;
  }

  createYupSchemaEntry(opts) {
    return this.config.createYupSchemaEntry(opts);
  }

  createValue(entryObj, key) {
    if (typeof entryObj === "string") {
      entryObj = {
        [entryObj]: true
      };
    }
    if (!isObjectType(entryObj)) {
      this.error(`createValue: ${key} must be a schema object`);
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

  createEntry(entryObj, whenKey) {
    const opts = this.createEntryOpts(entryObj, whenKey);
    return this.createYupSchemaEntry(opts);
  }

  hasKey(keys, findKey) {
    return keys.find(key => key === findKey);
  }

  hasAnyKey(keys, findKeys) {
    return keys.find(key => findKeys.includes(key));
  }

  // checkIs(is, present) {
  //   present = present || this.whenEntryKeysPresent;
  //   const checked = (is === true && present) || (is === false && !present);
  //   // const keys = this.whenEntryKeys;
  //   return checked;
  // }

  whenEntryFor(whenObj, createEntryKey, whenKey) {
    whenKey = whenKey || createEntryKey;

    if (isStringType(whenObj)) {
      whenObj = {
        [whenObj]: true
      };
    }

    if (!isObjectType(whenObj)) {
      throw `whenEntryFor: Invalid when object ${whenObj}`;
    }

    // clone
    const entryDef = {
      ...whenObj[whenKey]
    };
    delete whenObj[whenKey];
    if (!entryDef) return whenObj;
    whenObj[createEntryKey] = this.createEntry(entryDef, createEntryKey);
    return whenObj;
  }

  calcEntryObj() {
    // clone
    let whenEntryObj = {
      ...this.whenEntryObj
    };

    // const { is } = whenEntryObj;
    // const checkedIs = this.checkIs(is);
    // if (!checkedIs) {
    //   this.warn(`calcEntryObj: missing or invalid is constraint`, is);
    //   return whenEntryObj;
    // }
    const otherwiseKey = whenEntryObj.then ? "else" : "otherwise";

    whenEntryObj = this.whenEntryFor(whenEntryObj, "then");
    whenEntryObj = this.whenEntryFor(whenEntryObj, "otherwise", otherwiseKey);
    return whenEntryObj;
  }

  get entryObj() {
    return this.validateAndConfigure() && this.calcEntryObj();
  }

  warn(msg, value) {
    console.error("[WhenEntry] WARNING", msg, value);
  }

  error(msg, value) {
    console.error("[WhenEntry] ERROR", msg, value);
    throw msg;
  }
}

export const createWhenEntry = (whenEntry, opts = {}) => {
  return new WhenEntry(whenEntry, opts);
};
