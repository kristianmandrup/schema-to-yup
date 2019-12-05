import { BasePropertyValueResolver } from "./base-property-value-resolver";

export const createSinglePropertyValueResolver = (opts, config) => {
  return new SinglePropertyValueResolver(opts, config);
};

export class SinglePropertyValueResolver extends BasePropertyValueResolver {
  constructor(opts, config) {
    super(opts, config);
  }

  resolve() {
    const { value } = this;
    if (Array.isArray(value)) return;
    const toSingleType = this.config.toSingleType;
    if (toSingleType) {
      return toSingleType(this);
    }

    const { obj, config } = this;
    const typeHandlerNames = Object.keys(this.types);
    let result;
    // iterate all registered type handlers in this.types
    for (let typeName of typeHandlerNames) {
      const typeFn = this.types[typeName];
      if (typeFn) {
        result = typeFn(obj, config);
      }
      if (result) break;
    }
    return result;
  }
}
