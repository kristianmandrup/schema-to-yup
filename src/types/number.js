const {
  YupMixed
} = require('./mixed')

function isInteger(type) {
  return type === 'integer'
}

function isNumber(type) {
  return type === 'number' || isInteger(type)
}

function toYupNumber(obj) {
  return isNumber(obj.type) && YupNumber.create(obj).yupped()
}


class YupNumber extends YupMixed {
  constructor(obj) {
    super(obj)
    this.type = obj.type || 'number'
    this.base = this.yup[this.type]()
  }

  static create(obj) {
    return new YupNumber(obj)
  }

  convert() {
    this.minimum().maximum().positive().negative().integer().moreThan().lessThan()
    super.convert()
    return this
  }

  integer() {
    this.isInteger && this.base.integer(this.errMessage['integer'])
    return this
  }

  get isInteger() {
    return isInteger(this.type)
  }

  toNumber(num) {
    return Number(num)
  }

  moreThan() {
    const min = this.$moreThan
    min && this.base.moreThan(this.toNumber(min))
    return this
  }

  lessThan() {
    const max = this.$lessThan
    max && this.base.lessThan(this.toNumber(max))
    return this
  }

  get $moreThan() {
    const {
      exclusiveMinimum,
      moreThan
    } = this.value
    if (moreThan) return moreThan
    if (exclusiveMinimum === undefined) return false
    return exclusiveMinimum
  }

  get $lessThan() {
    const {
      exclusiveMaximum,
      lessThan
    } = this.value
    if (lessThan) return lessThan
    if (exclusiveMaximum === undefined) return false
    return exclusiveMaximum
  }

  positive() {
    this.isPositive && this.base.positive(this.errMessage['positive'])
    return this
  }

  negative() {
    this.isNegative && this.base.negative(this.errMessage['negative'])
    return this
  }

  get isNegative() {
    const {
      exclusiveMaximum,
      negative
    } = this.value
    if (negative) return true
    if (exclusiveMaximum === undefined) return false
    return exclusiveMaximum === 0
  }

  get isPositive() {
    const {
      exclusiveMinimum,
      positive
    } = this.value
    if (positive) return true
    if (exclusiveMinimum === undefined) return false
    return exclusiveMinimum === 0
  }

  minimum() {
    this.value.minimum && this.base.min(this.toNumber(this.value.minimum), this.errMessages['minimum'])
    return this
  }

  maximum() {
    this.value.maximum && this.base.max(this.toNumber(this.value.maximum), this.errMessages['maximum'])
    return this
  }

  normalize() {
    this.value.maximum = this.value.maximum || this.value.max
    this.value.minimum = this.value.minimum || this.value.min
  }
}

module.exports = {
  toYupNumber,
  YupNumber
}
