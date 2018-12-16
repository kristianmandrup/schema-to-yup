// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4
import { MixedSchemaEntry } from "../mixed";
import { ArrayGuard, createArrayGuard } from "./guard";

const proceed = (obj, config = {}) => {
  return createArrayGuard(obj, config).verify();
};

function toYupArray(obj, config = {}) {
  return proceed(obj, config) && buildYupArray(obj);
}

function toYupArraySchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

function buildSchemaEntry(obj) {
  return ArraySchemaEntry.schemaEntryFor(obj);
}

function buildYupArray(obj) {
  return ArraySchemaEntry.create(obj);
}

// Note: all types inherit from mixed
// See https://github.com/jquense/yup#mixed
class ArraySchemaEntry extends MixedSchemaEntry {
  createYupSchemaEntry: Function;

  constructor(obj) {
    super(obj);
    this.type = "array";
    // this.validatorTypeApi = this.yup.array();
    this.createYupSchemaEntry = this.config.createYupSchemaEntry;
  }

  static create(obj) {
    return new ArraySchemaEntry(obj);
  }

  static schemaEntryFor(obj) {
    return ArraySchemaEntry.create(obj).convert();
  }

  convert() {
    // this.$uniqueItems()
    //   .$contains()
    //   .$additionalItems()
    //   .$items();

    // this.itemsOf()

    super.convert();
    return this;
  }

  get constraintsTypeMap() {
    return {
      rangeItems: "numeric",
      maxItems: "numeric",
      minItems: "numeric"
    };
  }

  get constraintsMap() {
    return {
      on: ["ensure", "compact"]
    };
  }

  get aliasMap() {
    return {
      minItems: ["min"],
      maxItems: ["max"]
    };
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
    if (!this.isArrayType($max)) {
      return this;
    }
    // TODO: use Numeric constraint
    // if (!this.isValidSize($max)) {
    //   return this.handleInvalidSize("maxItems", $max);
    // }
    // const newBase = $max && this.base.max($max);
    // this.validatorTypeApi = newBase || this.base;
    return this;
  }

  get constraintsCheckMap() {
    return {
      size: num => this.isArrayType(num) && num >= 0
    };
  }
}
