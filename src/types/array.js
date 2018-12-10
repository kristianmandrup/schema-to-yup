// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

const { YupMixed } = require("./mixed");
const { createYupSchemaEntry } = require("../");

class ArrayHandler {
  constructor(config) {
    this.config = config;
  }

  isString(obj) {
    return this.config.isArray(obj);
  }

  handle(obj) {
    return this.isArray(obj) && YupString.create(obj).yupped();
  }
}

function toYupArray(obj, config = {}) {
  return new ArrayHandler(config).handle(obj);
}

class YupArray extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "array";
    this.base = this.yup[this.type]();
  }

  convert() {
    this.maxItems()
      .minItems()
      .itemsOf()
      .ensure()
      .compact();
    this.$uniqueItems()
      .$contains()
      .$additionalItems()
      .$items();
    super.convert();
    return this;
  }

  ensure() {
    return this.addContraint("ensure");
  }

  compact() {
    return this.addContraint("compact");
  }

  itemsOf() {
    const { items, itemsOf } = this.constraints;
    const $itemsOfSchema = items || itemsOf || this.constraints.of;

    if (Array.isArray($itemsOfSchema)) {
      this.error("itemsOf", "does not (yet) support an Array of schemas");
    }

    createYupSchemaEntry({
      key: this.key,
      value: $itemsOfSchema,
      type: this.type,
      config: this.config
    });
    $of && this.base.of($max);
    return this;
  }

  maxItems() {
    const { maxItems, max } = this.constraints;
    const $max = maxItems || max;
    const newBase = $max && this.base.max($max);
    this.base = newBase || this.base;
    return this;
  }

  minItems() {
    const { minItems, min } = this.constraints;
    const $min = minItems || min;
    $min && this.base.min($min);
    return this;
  }

  $items() {
    return this;
  }

  $additionalItems() {
    return this;
  }

  $uniqueItems() {
    return this;
  }

  $contains() {
    return this;
  }
}

module.exports = {
  toYupArray,
  YupArray,
  ArrayHandler
};
