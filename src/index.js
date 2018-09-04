const yup = require('yup');
const {
  toYupString,
  toYupNumber,
  toYupBoolean,
  toYupArray,
  toYupObject,
  toYupMixed,
  toYupDate
} = require('./types')

module.exports = (schema, config = {}) => {
  let {
    type,
    properties
  } = schema
  if (isObject(type)) {
    if (properties) {
      properties = normalizeRequired(schema)
      const shapeConfig = propsToShape(properties, config)
      return yup.object().shape(shapeConfig)
    }
  }
  throw new Error('invalid schema')
}

function isObject(type) {
  return type && type === 'object'
}

function normalizeRequired(schema) {
  const {
    properties,
    required
  } = schema
  return Object.keys(properties).reduce((acc, key) => {
    const value = properties[key]
    const isRequired = required.indexOf(key) >= 0
    value.required = value.required || isRequired
    acc[key] = value
    return acc
  }, {})
}

function propsToShape(properties, config = {}) {
  return Object.keys(properties).reduce((acc, key) => {
    const value = properties[key]
    acc[key] = propToYupSchemaEntry(key, value, config)
    return acc
  }, {})
}

function propToYupSchemaEntry(key, value, config = {}) {
  return new YupSchemaEntry(key, value, config).toEntry()
}

class YupSchemaEntry {
  constructor(key, value, config) {
    this.key = key
    this.value = value
    this.config = config
    this.type = value.type
  }

  toEntry() {
    const typeSchema = this.typeSchema()
    return typeSchema
  }

  typeSchema() {
    if (this.type) {
      return this.string ||
        this.number ||
        this.boolean ||
        this.array ||
        this.object ||
        this.date ||
        this.mixed
    }
    return this.mixed
  }

  get obj() {
    return {
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    }
  }

  get string() {
    return toYupString(this.obj)
  }

  get number() {
    return toYupNumber(this.obj)
  }

  get boolean() {
    return toYupBoolean(this.obj)
  }

  get array() {
    return toYupArray(this.obj)
  }

  get object() {
    return toYupObject(this.obj)
  }

  get date() {
    return toYupDate(this.obj)
  }

  get mixed() {
    return toYupMixed(this.obj)
  }
}
