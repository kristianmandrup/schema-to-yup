const {
  YupMixed
} = require('./mixed')

function isString(type) {
  return type === 'string'
}

function toYupString(obj) {
  return isString(obj.type) && YupString.create(obj).yupped()
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
    this.minLength().maxLength().pattern()
    super.convert()
    return this
  }

  email() {
    this.format === 'email' && this.base.email(this.errMessages['email'])
  }

  url() {
    this.format === 'url' && this.base.url(this.errMessages['url'])
  }

  minLength() {
    this.value.minLength && this.base.min(this.value.minLength, this.errMessages['minLength'] || this.errMessages['min'])
    return this
  }

  maxLength() {
    this.value.maxLength && this.base.min(this.value.maxLength, this.errMessages['maxLength'] || this.errMessages['max'])
    return this
  }

  pattern() {
    this.value.pattern && this.base.matches(this.value.pattern, this.errMessages['pattern'] || this.errMessages['matches'] || this.errMessages['regex'])
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
