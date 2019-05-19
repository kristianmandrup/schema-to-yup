import { classify, Loggable, util } from "@schema-validator/core";
import { ObjectSchemaEntryWalker } from "../object/object";
import { ArraySchemaEntryWalker } from "../array/array";
const { schemaEntryMainTypeOf } = util;

type VoidEntryFn = (entry: any) => void;

export interface ISchemaEntryWalker {
  walk: VoidEntryFn;
  onEnterEntry: VoidEntryFn;
  onExitEntry: (entry: any, result: any) => void;
}

const schemaTypeWalkerMap = {
  object: opts => new ObjectSchemaEntryWalker(opts),
  array: opts => new ArraySchemaEntryWalker(opts),
  primitive: opts => new SchemaEntryWalker(opts)
};

export class SchemaEntryWalker extends Loggable implements ISchemaEntryWalker {
  _entry: any;
  config: any;
  opts: any;
  listeners: any[];
  wasCacheHit: boolean = false;
  key: string = "";

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    this.opts = opts;
    this.listeners = config.listeners;
  }

  init() {}

  walkEntry(entry: any) {
    this.onEnterEntry(entry);
    this.entry = entry;
    const result = this.walk(entry);
    this.walkChildEntries();
    this.onExitEntry(entry, result);
  }

  walkChildEntries() {
    return this.children.map(this.walkChildEntry);
  }

  walkChildEntry = (entry: any) => {
    const schemaType = this.entryType(entry);
    if (!this.isValidChildEntryType(schemaType)) {
      this.invalidChildEntryType(entry);
    }
    return this.schemaTypeWalkerFor(schemaType).walkEntry(entry);
  };

  invalidChildEntryType(entry: any) {
    this.error("walkChild", "invalid child entry type", entry);
  }

  isValidChildEntryType(entryType: string) {
    return true;
  }

  schemaTypeWalkerFor(schemaType) {
    const walkerFactory = this.schemaTypeWalkerFactoryFor(schemaType);
    return walkerFactory(this.opts, this.config);
  }

  schemaTypeWalkerFactoryFor(schemaType) {
    return schemaTypeWalkerMap[schemaType];
  }

  entryType(entry: any) {
    return schemaEntryMainTypeOf(entry.type);
  }

  get entry() {
    return this._entry;
  }

  set entry(entry) {
    this._entry = entry;
  }

  get children() {
    return [];
  }

  walk(entry: any): any {
    return entry;
  }

  onEnterEntry(entry: any) {
    this.genericOnEntry({ lifecycle: "Enter", entry });
  }

  onExitEntry(entry: any, result: any) {
    this.genericOnEntry({ lifecycle: "Exit", entry, result });
  }

  genericOnEntry(opts: any = {}) {
    let { lifecycle, entry, result } = opts;
    lifecycle = lifecycle || "Enter";
    const { type } = entry;
    const methodName = this.methodName(type, lifecycle);
    this.listeners.map(listener => {
      const eventHandler = listener[methodName];
      eventHandler(entry, result);
    });
  }

  methodName(type: string, lifecycle: string) {
    type = classify(type);
    return `on${lifecycle}${type}`;
  }
}
