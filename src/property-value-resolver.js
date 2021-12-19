import { BasePropertyValueResolver } from "./base-property-value-resolver";
import { MultiPropertyValueResolver } from "./multi-property-value-resolver";
import { SinglePropertyValueResolver } from "./single-property-value-resolver";

export const createPropertyValueResolver = (opts, config, entryHandler) => {
  return new PropertyValueResolver(opts, config, entryHandler);
};

export class PropertyValueResolver extends BasePropertyValueResolver {
  constructor(opts, config) {
    super(opts, config);
    this.initResolvers();
  }

  initResolvers() {
    const { opts, config } = this;
    const createMultiTypeResolverFn =
      config.createMultiTypeResolver || this.createMultiTypeResolver.bind(this);
    this.multiTypeResolver = createMultiTypeResolverFn(opts, config);
    const createSingleTypeResolverFn =
      config.createSingleTypeResolver ||
      this.createSingleTypeResolver.bind(this);
    this.singleTypeResolver = createSingleTypeResolverFn(opts, config);
  }

  createMultiTypeResolver() {
    const { opts, config } = this;
    return new MultiPropertyValueResolver(opts, config);
  }

  createSingleTypeResolver() {
    const { opts, config } = this;
    return new SinglePropertyValueResolver(opts, config);
  }

  resolve() {
    return this.toMultiType() || this.toSingleType() || this.toDefaultEntry();
  }

  toMultiType() {
    const resolve =
      this.config.toMultiType ||
      this.singleTypeResolver.resolve.bind(this.singleTypeResolver);
    return resolve(this);
  }

  toSingleType() {
    const resolve =
      this.config.toSingleType ||
      this.singleTypeResolver.resolve.bind(this.singleTypeResolver);
    return resolve(this);
  }

  toDefaultEntry() {
    return this.defaultType();
  }

  defaultType() {
    this.error("toEntry: unknown type", this.type);
  }
}
