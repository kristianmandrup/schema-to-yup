const {
  YupMixed
} = require('./mixed')

function isBoolean(type) {
  return type === 'boolean'
}

function toYupBoolean(obj) {
  return isBoolean(obj.type) && YupBoolean.create(obj).yupped()
}

class YupBoolean extends YupMixed {
  constructor(obj) {
    super(obj)
    this.type = 'boolean'
    this.base = this.yup[this.type]()
  }

  static create(obj) {
    return new YupBoolean(obj)
  }
}

module.exports = {
  toYupBoolean,
  YupBoolean
}
