// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

const { YupMixed } = require("./mixed");

class ArrayHandler {
  constructor(config) {
    this.config = config;
  }

  isArray(value) {
    return this.config.isArray(value);
  }

  handle(value) {
    return this.isArray(value) && YupArray.create(value).yupped();
  }
}

function toYupArray(value, config = {}) {
  return value && new ArrayHandler(config).handle(value);
}

class YupArray extends YupMixed {
  constructor(value) {
    super(value);
    this.type = "array";
    this.base = this.yup.array();
    this.createYupSchemaEntry = this.config.createYupSchemaEntry;
  }

  static create(value) {
    return new YupArray(value);
  }

  convert() {
    this.maxItems();
    this.minItems();
    // this.ensureItems()
    // this.compact();
    // this.$uniqueItems()
    //   .$contains()
    //   .$additionalItems()
    //   .$items();

    // this.itemsOf()

    super.convert();
    return this;
  }

  ensureItems() {
    return this.addContraint("ensure");
  }

  compact() {
    return this.addContraint("compact");
  }

  // TODO: not yet implemented
  itemsOf() {
    return this;
    // const { items, itemsOf } = this.constraints;
    // const $itemsOfSchema = items || itemsOf || this.constraints.of;

    // if (Array.isArray($itemsOfSchema)) {
    //   this.error("itemsOf", "does not (yet) support an Array of schemas");
    // }

    // if (!this.createYupSchemaEntry) {
    //   this.warn(
    //     "missing createYupSchemaEntry in config, needed for recursive validation"
    //   );
    //   return;
    // }
    // this.createYupSchemaEntry({
    //   key: this.key,
    //   value: $itemsOfSchema,
    //   type: this.type,
    //   config: this.config
    // });
    // $of && this.base.of($max);
    // return this;
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
    const newBase = $min && this.base.min($min);
    this.base = newBase || this.base;
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
