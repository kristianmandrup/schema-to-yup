import { MappingBaseType } from "../../base";
import { createMappingItemFactory } from "../item";

export const createItemsMapping = (opts, config) => {
  return new MappingItems(opts, config);
};

export class MappingItems extends MappingBaseType {
  items: any[];
  ownerName: string;
  itemResolver: (item, config?: any) => any;

  constructor(opts: any = {}, config: any = {}) {
    super(opts, config);
    const { items, owner = {} } = opts;
    this.items = items;
    this.ownerName = owner.name;

    const createMappingItem = createMappingItemFactory(config);
    const itemResolver = item => {
      return createMappingItem(this.opts).resolve(item);
    };
    this.itemResolver = config.itemResolver || itemResolver;
  }

  resolve() {
    const resolveItem = this.resolveItem.bind(this);
    return this.items.map(resolveItem);
  }

  resolveItem(item) {
    item.ownerName = this.ownerName;
    return this.typeResolver(item);
  }

  typeResolver(item) {
    const payload = this.itemEntryPayload(item);
    return this.itemResolver(payload, this.config);
  }

  itemEntryPayload(item) {
    return {
      ownerName: this.key,
      item
    };
  }
}

module.exports = {
  createItemsMapping,
  MappingItems
};
