import { BaseSchemaEntryWalker } from "@schema-validator/schema-walker";
import { util } from "@schema-validator/core";

const { isFunction } = util;

export class ItemSchemaEntryWalker extends BaseSchemaEntryWalker {
  item: any;
  ownerName: string;

  constructor(opts: any = {}, config = {}) {
    super(opts, config);
    const { item, owner = {} } = opts;
    this.item = item;
    this.ownerName = owner.name;
  }

  walk(item: any) {
    return this.resolve(item);
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
