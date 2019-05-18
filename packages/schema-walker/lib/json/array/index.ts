import { MappingBaseType } from "../base";
import { isObjectType, isArray, isReferenceArray } from "../util";
export { isArray };

export function toArray(obj) {
  return isArray(obj.type) && MappingArray.create(obj).convert();
}

export class MappingArray extends MappingBaseType {
  get baseType() {
    return "nested";
  }

  get typeName() {
    return "array";
  }

  get entry() {
    return {
      ...this.lookedUpEntry,
      ...this.resolvedEntry
    };
  }

  get resolvedResult() {
    const result = this.createResult();
    if (this.isReference) {
      delete result.type;
    }
    return result;
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

  get referenceEntry() {
    return {
      _parent: { type: this.parentName },
      _source: { enabled: true },
      _all: { enabled: false }
    };
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

  get resolvedArrayType() {
    return this.typeMap[this.arrayType];
  }

  get type() {
    return this.configType || this.resolvedArrayType || this.baseType;
  }

  static create(obj) {
    return new MappingArray(obj).init();
  }
}
