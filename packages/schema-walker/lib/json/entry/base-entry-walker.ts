import { Loggable } from "@schema-validator/core";
import { SchemaTypeResolver } from "../resolver";

export class BaseSchemaEntryWalker extends Loggable {
  _entry: any;
  config: any;
  opts: any;
  listeners: any[];
  schemaTypeResolver: any;

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    this.opts = opts;
    this.listeners = config.listeners;
    this.schemaTypeResolver = new SchemaTypeResolver(opts, config);
  }

  init() {}

  get entry() {
    return this._entry;
  }

  set entry(entry) {
    this._entry = entry;
  }

  get children() {
    return [];
  }
}
