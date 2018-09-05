const {
  toYupString,
  toYupNumber,
  toYupBoolean,
  toYupArray,
  toYupObject,
  toYupMixed,
  toYupDate
} = require('./types')

class YupSchemaEntryError extends Error {

}

class YupSchemaEntry {
  constructor(key, value, config) {
    this.key = key
    this.value = value
    this.config = config
    this.type = value.type
    this.types = {
      string: toYupString,
      number: toYupNumber,
      boolean: toYupBoolean,
      array: toYupArray,
      object: toYupObject,
      date: toYupDate,
      mixed: toYupMixed,
    }
  }

  isValidSchema() {
    return typeof this.type === 'string'
  }

  error(msg) {
    throw new YupSchemaEntryError(msg)
  }

  toEntry() {
    if (!this.isValidSchema()) this.error('Not a valid schema')
    const config = this.obj
    return this.string(config) ||
      this.number(config) ||
      this.boolean(config) ||
      this.array(config) ||
      this.object(config) ||
      this.date(config) ||
      this.mixed(config)
  }

  get obj() {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    }
  }

  string(config) {
    return toYupString(config || this.obj)
  }

  number(config) {
    return toYupNumber(config || this.obj)
  }

  boolean(config) {
    return toYupBoolean(config || this.obj)
  }

  array() {
    return toYupArray(config || this.obj)
  }

  object() {
    return toYupObject(config || this.obj)
  }

  date(config) {
    return toYupDate(config || this.obj)
  }

  mixed(config) {
    return toYupMixed(config || this.obj)
  }
}

module.exports = {
  YupSchemaEntryError,
  YupSchemaEntry
}
