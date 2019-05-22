import { CompositeSchemaEntryWalker } from "@schema-validator/schema-walker";

export class ItemsSchemaEntryWalker extends CompositeSchemaEntryWalker {
  items: any[];
  ownerName: string;
  itemResolver: (item, config?: any) => any;
  resolveItem: any;

  constructor(opts: any = {}, config: any = {}) {
    super(opts, config);
    const { items, owner = {} } = opts;
    this.items = items;
    this.ownerName = owner.name || this.key;
    const createItemResolver = config.createItemResolver;
    const resolveItem = item => {
      return createItemResolver(this.opts).resolve(item);
    };
    this.resolveItem = resolveItem;
  }

  resolve() {
    const resolveItem = this.resolveItem.bind(this);
    return this.items.map(item => {
      const payload = this.itemEntryPayload(item);
      resolveItem(payload, this.config);
    });
  }

  itemEntryPayload(item) {
    return {
      ownerName: this.ownerName,
      item
    };
  }
}
