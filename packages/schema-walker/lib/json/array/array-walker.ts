import { SchemaEntryWalker } from "../entry";
import { util } from "@schema-validator/core";
export { isArray };

const { isObjectType, isArray, isReferenceArray } = util;

export class ArraySchemaEntryWalker extends SchemaEntryWalker {
  static create(obj, config = {}) {
    return new ArraySchemaEntryWalker(obj, config).init();
  }

  get schemaType() {
    return "array";
  }

  walk(entry: any) {
    // TODO
  }

  get includeInParent() {
    return true;
  }

  get resolvedEntry() {
    return this.isReference ? this.referenceEntry : this.nestedEntry;
  }

  get nestedEntry() {
    return this.includeInParent
      ? {
          include_in_parent: true
        }
      : {};
  }

  get isReference() {
    return isReferenceArray(this.entry);
  }

  get validItems() {
    return Array.isArray(this.items) || isObjectType(this.items);
  }

  get resolveFirstItem() {
    if (!this.validItems) return {};
    return Array.isArray(this.items) ? this.selectFirstItem : this.items;
  }

  get firstItem() {
    return this.items[0];
  }

  get selectFirstItem() {
    return this.hasValidItemTypes ? this.firstItem : this.invalidItemTypes();
  }

  get hasValidItemTypes() {
    return this.hasSameItemTypes;
  }

  get hasSameItemTypes() {
    const type = this.firstItem.type;
    return this.items.every(item => item.type === type);
  }

  get items() {
    return this.entry.items;
  }

  get children() {
    return this.items || [];
  }

  get arrayType() {
    return this.resolveFirstItem.type;
  }

  invalidItemTypes() {
    this.error(
      "invalidItemTypes",
      `Invalid item types for ${
        this.key
      }. All array items must share the same type to be mappable to ElasticSearch`,
      {
        schema: this.schema,
        items: this.items
      }
    );
  }
}
