import { MappingBaseType } from "../base";
import { isObjectType, isArray, isReferenceArray } from "../util";
export { isArray };

export function toArray(obj) {
  return isArray(obj.type) && MappingArray.create(obj).convert();
}

export class ArraySchemaEntryWalker extends SchemaEntryWalker {
  static create(obj) {
    return new ArraySchemaEntryWalker(obj).init();
  }
  
  get schemaType() {
    return "array"
  }

  get walk(entry: any) {
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
    return isReferenceArray(this.value);
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
    return this.value.items;
  }

  get arrayType() {
    return this.resolveFirstItem.type;
  }

  invalidItemTypes() {
    this.error(
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
