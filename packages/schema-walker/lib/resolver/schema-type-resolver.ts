import { Loggable, util } from "@schema-validator/core";
import { createSchemaTypeWalkerMap } from "./walker-map";
const { schemaEntryMainTypeOf } = util;

export class SchemaTypeResolver extends Loggable {
  opts: any;
  config: any;
  schemaTypeWalkerMap: any;

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    this.opts = opts;
    this.schemaTypeWalkerMap =
      config.schemaTypeWalkerMap || this.defaultTypeWalkerMap;
  }

  get defaultTypeWalkerMap() {
    return createSchemaTypeWalkerMap(this.config);
  }

  schemaTypeWalkerFor(schemaType) {
    const walkerFactory = this.schemaTypeWalkerFactoryFor(schemaType);
    return walkerFactory(this.opts, this.config);
  }

  schemaTypeWalkerFactoryFor(schemaType) {
    return this.schemaTypeWalkerMap[schemaType];
  }

  entryType(entry: any) {
    return schemaEntryMainTypeOf(entry.type);
  }
}
