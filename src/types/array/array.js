// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

import { YupMixed } from "../mixed";

export class YupArray extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "array";
    this.base = this.yup.array();
    this.createYupSchemaEntry = this.config.createYupSchemaEntry;
  }

  static create(obj) {
    return new YupArray(obj);
  }

  convert() {
    this.maxItems();
    this.minItems();
    this.ensureItems();
    this.compact();
    // this.$uniqueItems()
    //   .$contains()
    //   .$additionalItems()
    //   .$items();

    this.itemsOf();

    super.convert();
    return this;
  }

  ensureItems() {
    return this.addConstraint("ensure");
  }

  compact() {
    return this.addConstraint("compact");
  }

  itemsOf() {
    const { items, itemsOf } = this.constraints;
    const $of = items || itemsOf || this.constraints.of;

    if (this.isNothing($of)) return;

    if (Array.isArray($of)) {
      this.error("itemsOf", "does not (yet) support an Array of schemas");
      return;
    }

    if (!this.isObjectType($of)) {
      this.error("itemsOf", `must be a schema object, was ${typeof $of}`);
      return;
    }

    if (!this.createYupSchemaEntry) {
      this.warn(
        "missing createYupSchemaEntry in config, needed for recursive validation"
      );
      return;
    }

    try {
      const schemaConf = {
        key: this.key,
        value: $of,
        config: this.config
      };

      const schemaEntry = this.createYupSchemaEntry(schemaConf);

      return this.addConstraint("of", {
        constraintValue: schemaEntry,
        propValue: $of
      });
    } catch (ex) {
      this.error("itemsOf: Error", ex);
    }
    return this;
  }

  maxItems() {
    const { maxItems, max } = this.constraints;
    const $max = maxItems || max;
    if (!this.isNumberType($max)) {
      return this;
    }
    if (!this.isValidSize($max)) {
      return this.handleInvalidSize("maxItems", $max);
    }
    const newBase = $max && this.base.max($max);
    this.base = newBase || this.base;
    return this;
  }

  minItems() {
    const { minItems, min } = this.constraints;
    const $min = minItems || min;
    if (!this.isNumberType($min)) {
      return this;
    }
    if (!this.isValidSize($min)) {
      return this.handleInvalidSize("minItems", $min);
    }
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

  // utility

  handleInvalidSize(name, value) {
    const msg = `invalid array size constraint for ${name}, was ${value}. Must be a number >= 0`;
    if (this.config.warnOnInvalid) {
      this.warn(msg);
      return this;
    }
    this.error(msg, value);
    return this;
  }

  isValidSize(num) {
    return this.isNumberType(num) && num >= 0;
  }
}
