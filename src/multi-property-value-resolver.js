import { BasePropertyValueResolver } from "./base-property-value-resolver";

export const createMultiPropertyValueResolver = (opts, config) => {
  return new MultiPropertyValueResolver(opts, config);
};

export class MultiPropertyValueResolver extends BasePropertyValueResolver {
  constructor(opts, config) {
    super(opts, config);
  }

  resolve() {
    const { value, toMultiType } = this;
    if (!Array.isArray(value)) return;
    // TODO
    return toMultiType();
  }

  toMultiType() {
    const toMultiType = this.config.toMultiType;
    if (toMultiType) {
      return toMultiType(this);
    }  
  }
}
