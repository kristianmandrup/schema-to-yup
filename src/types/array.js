// See: http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

const {
  YupMixed
} = require('./mixed')

function isBoolean(type) {
  return type === 'array'
}

function toYupArray(obj) {
  return isArray(obj.type) && YupArray.create(obj).yupped()
}

class YupArray extends YupMixed {
  constructor(obj) {
    super(obj)
    this.type = 'array'
    this.base = this.yup[this.type]()
  }

  convert() {
    this.items().maxItems().minItems().uniqueItems().contains().additionalItems()
    super.convert()
    return this
  }

  items() {
    return this
  }

  additionalItems() {
    return this
  }

  maxItems() {
    const {
      maxItems,
      max
    } = this.value
    const $max = maxItems || max
    $max && this.base.min($max)
    return this
  }

  minItems() {
    const {
      minItems,
      min
    } = this.value
    const $min = maxItems || min
    $min && this.base.min($min)
    return this
  }

  uniqueItems() {
    return this
  }

  contains() {
    return this
  }
}

module.exports = {
  toYupArray,
  YupArray
}
