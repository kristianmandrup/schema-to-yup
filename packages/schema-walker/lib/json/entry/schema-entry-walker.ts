import { util } from "@schema-validator/core";
import { SchemaTypeResolver } from "../resolver";
import { BaseSchemaEntryWalker } from "./base-entry-walker";
const { classify } = util;

type VoidEntryFn = (entry: any) => void;

export interface ISchemaEntryWalker {
  walk: VoidEntryFn;
  onEnterEntry: VoidEntryFn;
  onExitEntry: (entry: any, result: any) => void;
}

export class SchemaEntryWalker extends BaseSchemaEntryWalker
  implements ISchemaEntryWalker {
  _entry: any;
  config: any;
  opts: any;
  listeners: any[];
  wasCacheHit: boolean = false;
  key: string = "";
  schemaTypeResolver: any;
  childEntryWalker: any;

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    this.opts = opts;
    this.listeners = config.listeners;
    this.schemaTypeResolver = new SchemaTypeResolver(opts, config);
    const createChildEntryWalker = config.createChildEntryWalker;
    this.childEntryWalker = createChildEntryWalker({ entryWalker: this });
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

  walkChildEntry(entry: any) {
    this.childEntryWalker.walkChildEntry(entry);
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
