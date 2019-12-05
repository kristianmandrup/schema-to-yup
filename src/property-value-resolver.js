import { BasePropertyValueResolver } from "./base-property-value-resolver";

export const createPropertyValueResolver = (opts, config) => {
  return new PropertyValueResolver(opts, config);
};

export class PropertyValueResolver extends BasePropertyValueResolver {
  constructor(opts, config) {
    super(opts, config);
    const createMultiTypeResolverFn =
      config.createMultiTypeResolver || this.createMultiTypeResolver;
    this.multiTypeResolver = createMultiTypeResolverFn(opts, config);
    const createSingleTypeResolverFn =
      config.createSingleTypeResolver || this.createSingleTypeResolver;
    this.singleTypeResolver = createSingleTypeResolverFn(opts, config);
  }

  resolve() {
    return this.toMultiType() || this.toSingleType() || this.toDefaultEntry();
  }

  toMultiType() {
    const resolve = this.config.toMultiType || this.singleTypeResolver.resolve;
    return resolve(this);
  }

  toSingleType() {
    const resolve = this.config.toSingleType || this.singleTypeResolver.resolve;
    return resolve(this);
  }

  toDefaultEntry() {
    return this.defaultType();
  }

  defaultType() {
    this.error("toEntry: unknown type", this.type);
  }
}
