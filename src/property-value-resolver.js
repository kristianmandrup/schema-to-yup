import { BasePropertyValueResolver } from "./base-property-value-resolver";
import { MultiPropertyValueResolver } from "./multi-property-value-resolver";
import { SinglePropertyValueResolver } from "./single-property-value-resolver";

export const createPropertyValueResolver = (opts, config, entryHandler) => {
  return new PropertyValueResolver(opts, config, entryHandler);
};

export class PropertyValueResolver extends BasePropertyValueResolver {
  constructor(opts, config, entryHandler) {
    super(opts, config, entryHandler);
    this.initResolvers();
  }

  initResolvers() {
    const { opts, config, entryHandler } = this;
    const createMultiTypeResolverFn =
      config.createMultiTypeResolver || this.createMultiTypeResolver.bind(this);
    this.multiTypeResolver = createMultiTypeResolverFn(
      opts,
      config,
      entryHandler
    );
    const createSingleTypeResolverFn =
      config.createSingleTypeResolver ||
      this.createSingleTypeResolver.bind(this);
    this.singleTypeResolver = createSingleTypeResolverFn(
      opts,
      config,
      entryHandler
    );
  }

  createMultiTypeResolver() {
    const { opts, config, entryHandler } = this;
    return new MultiPropertyValueResolver(opts, config, entryHandler);
  }

  createSingleTypeResolver() {
    const { opts, config, entryHandler } = this;
    return new SinglePropertyValueResolver(opts, config, entryHandler);
  }

  resolve() {
    return this.toMultiType() || this.toSingleType() || this.toDefaultEntry();
  }

  toMultiType() {
    const resolve =
      this.config.toMultiType ||
      this.multiTypeResolver.resolve.bind(this.multiTypeResolver);
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
    return false;
  }
}
