import { MappingBaseType } from "../../base";
import { isFunction } from "../../util";
import { buildConfig } from "../../../build-config";

export const createMappingItemFactory = (config = {}) => {
  config = buildConfig(config);
  return opts => {
    return new MappingItem(opts, config);
  };
};

export class MappingItem extends MappingBaseType {
  item: any;
  ownerName: string;

  constructor(opts: any = {}, config = {}) {
    super(opts, config);
    const { item, owner = {} } = opts;
    this.item = item;
    this.ownerName = owner.name;
  }

  get resolver() {
    return this.config.itemResolver;
  }

  get validatedResolver() {
    if (!isFunction(this.resolver)) {
      this.error(
        "typeResolver",
        "Missing itemResolver (pass in config factories map)"
      );
    }
    return this.resolver;
  }

  resolve(item) {
    this.item = item || this.item;
    const payload = this.itemEntryPayload;
    return this.validatedResolver(payload, this.config);
  }

  get itemEntryPayload() {
    return {
      parentName: this.ownerName,
      value: this.item
    };
  }
}

module.exports = {
  createMappingItemFactory,
  MappingItem
};
