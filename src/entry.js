import { 
  Base,
  toYupString,
  toYupNumberSchemaEntry,
  toYupBoolean,
  toYupArray,
  toYupObject,
  toYupDate
} from './types';

class YupSchemaEntryError extends Error {}

class YupSchemaEntry extends Base {
  constructor({ name, key, value, config }) {
    super(config);
    this.key = key;
    this.value = value;
    this.config = config;
    this.name = name;
    this.type = value.type;
    this.types = {
      string: toYupString,
      number: toYupNumberSchemaEntry,
      boolean: toYupBoolean,
      array: toYupArray,
      object: toYupObject,
      date: toYupDate
    };
  }

  isValidSchema() {
    return typeof this.type === "string";
  }

  error(msg) {
    throw new YupSchemaEntryError(msg);
  }

  toEntry() {
    if (!this.isValidSchema()) this.error("Not a valid schema");
    const config = this.obj;
    return (
      this.string(config) ||
      this.number(config) ||
      this.boolean(config) ||
      this.array(config) ||
      this.object(config) ||
      this.date(config) ||
      this.mixed(config)
    );
  }

  get obj() {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }

  string(obj) {
    return toYupString(obj || this.obj, this.config);
  }

  number(obj) {
    return toYupNumberSchemaEntry(obj || this.obj, this.config);
  }

  boolean(obj) {
    return toYupBoolean(obj || this.obj, this.config);
  }

  array(obj) {
    return toYupArray(obj || this.obj, this.config);
  }

  object(obj) {
    return toYupObject(obj || this.obj, this.config);
  }

  date(obj) {
    return toYupDate(obj || this.obj, this.config);
  }
}

export {
  YupSchemaEntryError,
  YupSchemaEntry,
  Base
};
