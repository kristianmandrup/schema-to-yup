// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

import { YupMixed } from "../mixed";

export class YupArray extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.baseType;
    this.base = this.validatorInstance;
    this.createYupSchemaEntry = this.config.createYupSchemaEntry;
  }

  get baseType() {
    return "array";
  }

  get validatorInstance() {
    return this.validator.array();
  }

  static create(obj) {
    return new YupArray(obj);
  }

  convert() {
    super.convert();
    return this;
  }

  get typeEnabled() {
    return ["maxItems", "minItems", "ensureItems", "compact", "itemsOf"];
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
      const value = $of
      const schemaConf = {
        key: this.key,
        value,
        config: this.config
      };
      this.log('array:of', {schemaConf})
      const schemaEntry = this.createYupSchemaEntry(schemaConf);
      this.log('array:of', {schemaEntry})
      return this.addConstraint("of", {
        constraintValue: schemaEntry,
        propValue: value,
        value
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
