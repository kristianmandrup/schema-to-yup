const {YupMixed} = require('./mixed')

function isString(type) {
  return type === 'string'
}

function toYupString(obj) {
  return isString(obj.type) && YupString
    .create(obj)
    .yupped()
}

class YupString extends YupMixed {
  constructor(obj) {
    super(obj)
    this.type = 'string'
    this.base = this.yup[this.type]()
  }

  static create(obj) {
    return new YupString(obj)
  }

  convert() {
    this
      .minLength()
      .maxLength()
      .pattern()
    this
      .lowercase()
      .uppercase()
    super.convert()
    return this
  }

  trim() {
    this.value.trim && this
      .base
      .trim(this.valErrMessage('trim'))
    return this
  }

  lowercase() {
    this.value.lowercase && this
      .base
      .lowercase(this.valErrMessage('lowercase'))
    return this
  }

  uppercase() {
    this.value.uppercase && this
      .base
      .uppercase(this.valErrMessage('uppercase'))
    return this
  }

  email() {
    this.isEmail && this
      .base
      .email(this.valErrMessage('email'))
  }

  get isEmail() {
    return this.value.email || this.format === 'email'
  }

  url() {
    this.isUrl && this
      .base
      .url(this.valErrMessage('url'))
  }

  get isUrl() {
    return this.value.url || this.format === 'url'
  }

  minLength() {
    this.value.minLength && this
      .base
      .min(this.value.minLength, this.valErrMessage('minLength') || this.valErrMessage('min'))
    return this
  }

  maxLength() {
    this.value.maxLength && this
      .base
      .min(this.value.maxLength, this.valErrMessage('maxLength') || this.valErrMessage('max'))
    return this
  }

  pattern() {
    this.value.pattern && this
      .base
      .matches(this.value.pattern, this.valErrMessage('pattern') || this.valErrMessage('matches') || this.valErrMessage('regex'))
    return this
  }

  normalize() {
    this.value.pattern = this.value.pattern || this.value.matches || this.value.regex
    this.value.maxLength = this.value.maxLength || this.value.max
    this.value.minLength = this.value.minLength || this.value.min
  }
}

module.exports = {
  toYupString,
  YupString
}
