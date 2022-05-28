import { BasePropertyValueResolver } from "./base-property-value-resolver";

export const createMultiPropertyValueResolver = (opts, config) => {
  return new MultiPropertyValueResolver(opts, config);
};

export class MultiPropertyValueResolver extends BasePropertyValueResolver {
  constructor(opts, config, entryHandler) {
    super(opts, config, entryHandler);
  }

  resolve() {
    const { value } = this;
    if (!Array.isArray(value)) return;
    const toMultiType = this.config.toMultiType;
    if (toMultiType) {
      return toMultiType(this);
    }
    return this.oneOf();
  }

  oneOf() {
    const schemaValues = this.value
    const createEntry = this.createEntry.bind(this)
    const resolvedValidatorSchemas = schemaValues.map(createEntry)
    return this.mixed().oneOf(resolvedValidatorSchemas)
  }

  notOneOf() {
    const schemaValues = this.value
    const createEntry = this.createEntry.bind(this)
    const resolvedValidatorSchemas = schemaValues.map(createEntry)
    return this.mixed().notOneOf(resolvedValidatorSchemas)
  }

  createEntry(value) {
    const { createYupSchemaEntry } = this.config
    value = normalizedValue(value)
    const opts = { schema: this.schema, key: this.key, value, config: this.config }
    return createYupSchemaEntry(opts)
  }

  normalizedValue(value) {
    return typeof value === 'string' ? {type: value}: value
  }

  mixed() {
    return this.validator.mixed()
  }
}
