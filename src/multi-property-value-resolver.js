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
    const { createYupSchemaEntry } = this.config
    const resolvedValidatorSchemas = schemaValues.map(value => {
      const opts = { schema: this.schema, key: this.key, value, config: this.config }
      return createYupSchemaEntry(opts)
    })
    return this.mixed().oneOf(resolvedValidatorSchemas)
  }

  mixed() {
    return this.validator.mixed()
  }
}
