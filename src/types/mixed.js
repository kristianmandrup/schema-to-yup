const yup = require('yup')

class ConvertYupSchemaError extends Error {}

const errValKeys = [
  'oneOf',
  'enum',
  'required',
  'notRequired',
  'minDate',
  'min',
  'maxDate',
  'max',
  'trim',
  'lowercase',
  'uppercase',
  'email',
  'url',
  'minLength',
  'maxLength',
  'pattern',
  'matches',
  'regex',
  'integer',
  'positive',
  'minimum',
  'maximum'
]

const defaults = {
  errMessages: errValKeys.map(key => {
    return ({key, value}) => `${key}: invalid for ${value}`
  })
}

class YupMixed {
  constructor({key, value, config}) {
    this.yup = yup
    this.key = key
    this.value = value
    this.format = value.format
    this.config = config || {}
    this.type = 'mixed'
    this.base = yup[this.type]()
    this.errMessages = config.errMessages || defaults.errMessages || {}
  }

  yupped() {
    return this
      .convert()
      .base
  }

  convert() {
    this
      .nullable()
      .required()
      .notRequired()
      .oneOf()
      .notOneOf()
      .ensureDefault()
      .strict()
    return this
  }

  ensureDefault() {
    this.value.default && this
      .base
      .default(this.value.default)
    return this
  }

  strict() {
    this.value.strict && this
      .base
      .strict(this.value.strict)
    return this
  }

  required() {
    this.value.required && this
      .base
      .required(this.valErrMessage('required'))
    return this
  }

  notRequired() {
    this.value.notRequired && this
      .base
      .notRequired(this.valErrMessage('notRequired'))
    return this
  }

  nullable() {
    this.value.nullable && this
      .base
      .nullable(this.valErrMessage('nullable'))
    return this
  }

  oneOf() {
    const {oneOf} = this.value
    const $oneOf = this.value.enum || oneOf
    $oneOf && this
      .base
      .oneOf($oneOf, this.valErrMessage('oneOf') || this.valErrMessage('enum'))
    return this
  }

  notOneOf() {
    const {not, notOneOf} = this.value
    const $oneOf = notOneOf || (not && (not.enum || not.oneOf))
    $oneOf && this
      .base
      .notOneOf($oneOf, this.valErrMessage('notOneOf'))
    return this
  }

  valErrMessage(key) {
    const errMsg = this.errMessages[key]
    return typeof errMsg === 'function'
      ? errMsg(this.value)
      : errMsg
  }

  $const() {
    return this
  }

  // boolean https: //ajv.js.org/keywords.html#allof
  $allOf() {
    return this
  }

  // https://ajv.js.org/keywords.html#anyof
  $anyOf() {
    return this
  }

  // https: //ajv.js.org/keywords.html#oneof
  $oneOf() {
    return this
  }

  // conditions https://ajv.js.org/keywords.html#not
  $not() {
    return this
  }

  $if() {
    return this
  }

  $then() {
    return this
  }

  $else() {
    return this
  }

  message() {
    return config.messages[this.key] || config.messages[this.type] || {}
  }

  errMessage(errKey = 'default') {
    return this.message[errKey] || 'error'
  }

  toValidJSONSchema() {}

  normalize() {}

  deNormalize() {}

  error(name, msg) {
    const label = `[${name}] ${msg}`
    throw new ConvertYupSchemaError(msg)
  }
}

module.exports = {
  YupMixed,
  ConvertYupSchemaError
}
