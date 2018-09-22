const yup = require('yup');
const {YupSchemaEntry, YupSchemaEntryError} = require('./entry');

function buildYup(schema, config = {}) {
  let {type, properties} = schema
  if (isObject(type)) {
    if (properties) {
      const name = schema.title || schema.name
      properties = normalizeRequired(schema)
      const shapeConfig = propsToShape({properties, name, config})
      return yup
        .object()
        .shape(shapeConfig)
    }
  }
  throw new Error('invalid schema')
}

function isObject(type) {
  return type && type === 'object'
}

function normalizeRequired(schema) {
  const {properties, required} = schema
  return Object
    .keys(properties)
    .reduce((acc, key) => {
      const value = properties[key]
      const isRequired = required.indexOf(key) >= 0
      value.required = value.required || isRequired
      acc[key] = value
      return acc
    }, {})
}

function propsToShape({
  properties,
  name,
  config = {}
}) {
  return Object
    .keys(properties)
    .reduce((acc, key) => {
      const value = properties[key]
      acc[key] = propToYupSchemaEntry({name, key, value, config})
      return acc
    }, {})
}

function propToYupSchemaEntry({
  name,
  key,
  value,
  config = {}
}) {
  const entryBuilder = createYupSchemaEntry || config.createYupSchemaEntry
  return entryBuilder({name, key, value, config})
}

function createYupSchemaEntry({name, key, value, config}) {
  return new YupSchemaEntry({name, key, value, config}).toEntry()
}

const types = require('./types')

module.exports = {
  buildYup,
  createYupSchemaEntry,
  YupSchemaEntry,
  YupSchemaEntryError,
  types
}
