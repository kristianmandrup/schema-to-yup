const {
  YupMixed
} = require('./mixed')

const {
  buildYup
} = require('../')

function toYupObject(obj) {
  return isObject(obj.type) && YupObject.create(obj).yupped()
}

// Allow recursive schema
class YupObject extends YupMixed {
  constructor(obj) {
    super(obj)
    this.type = 'object'
    this.base = this.yup[this.type]()
    this.properties = this.value.properties
  }

  convert() {
    if (!this.properties) return
    // recursive definition
    const schema = buildYup(this.value)
    this.base.shape(schema)
  }
}

module.exports = {
  toYupObject,
  YupObject
}
