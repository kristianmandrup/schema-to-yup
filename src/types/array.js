// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

import { YupMixed } from "./mixed";
import { Base } from "./base";

class ArrayHandler extends Base {
  constructor(config) {
    super(config);
  }

  isArray(obj) {
    if (!this.config.isArray) {
      this.error("ArrayHandler: mising isArray in config", this.config);
    }
    return this.config.isArray(obj);
  }

  handle(obj) {
    return this.isArray(obj) && YupArray.create(obj).createSchemaEntry();
  }
}

function toYupArray(obj, config = {}) {
  return obj && new ArrayHandler(config).handle(obj);
}

class YupArray extends YupMixed {
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

    // console.log("itemsOf", { of: $of });

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
        // schema: this.schema,
        // properties: this.properties,
        key: this.key,
        value: {
          ...$of,
          of: $of
        },
        // type: this.type,
        config: this.config
      };

      // const schemaConf = {
      //   value: $of,
      //   config: this.config
      // };

      console.log("itemsOf", schemaConf);

      const schemaEntry = this.createYupSchemaEntry(schemaConf);

      console.log("itemsOf", { schemaEntry });

      // TODO
      // populate subtype!!
      // _subType: undefined

      // this.buildConstraint
      return this.addConstraint("of", {
        value: schemaEntry,
        propValue: $of
        // yup: yup.array()
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

export { toYupArray, YupArray, ArrayHandler };
