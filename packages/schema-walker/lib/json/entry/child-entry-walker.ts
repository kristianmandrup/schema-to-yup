import { BaseSchemaEntryWalker } from "./base-entry-walker";

export class ChildEntryWalker extends BaseSchemaEntryWalker {
  constructor(opts = {}, config = {}) {
    super(opts, config);
  }

  entryType(entry) {
    return this.schemaTypeResolver.entryType(entry);
  }

  schemaTypeWalkerFor(type) {
    return this.schemaTypeResolver.schemaTypeWalkerFor(type);
  }

  walkChildEntry = (entry: any) => {
    const schemaType = this.validateChildEntryType(entry);
    return this.schemaTypeWalkerFor(schemaType).walkEntry(entry);
  };

  validateChildEntryType(entry: any): string {
    const schemaType = this.entryType(entry);
    if (!this.isValidChildEntryType(schemaType)) {
      this.invalidChildEntryType(entry);
    }
    return schemaType;
  }

  invalidChildEntryType(entry: any) {
    this.error("walkChild", "invalid child entry type", entry);
  }

  isValidChildEntryType(entryType: string) {
    return true;
  }
}
