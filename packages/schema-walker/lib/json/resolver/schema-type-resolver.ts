import { Loggable, util } from "@schema-validator/core";
const { schemaEntryMainTypeOf } = util;

export class SchemaTypeResolver extends Loggable {
  opts: any;
  config: any;
  schemaTypeWalkerMap: any;

  constructor(opts, config) {
    super(config);
    this.opts = opts;
    this.schemaTypeWalkerMap = config.schemaTypeWalkerMap;
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
