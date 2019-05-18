import { classify, Loggable } from "@schema-validator/core";

type VoidEntryFn = (entry: any) => void;

export interface ISchemaEntryWalker {
  walk: VoidEntryFn;
  onEnterEntry: VoidEntryFn;
  onExitEntry: (entry: any, result: any) => void;
}

export class SchemaEntryWalker extends Loggable implements ISchemaEntryWalker {
  _entry: any;
  listeners: any[];
  wasCacheHit: boolean = false;
  key: string = "";

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    this.listeners = config.listeners;
  }

  init() {}

  walkEntry(entry: any) {
    this.onEnterEntry(entry);
    this.entry = entry;
    const result = this.walk(entry);
    this.onExitEntry(entry, result);
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

  walk(entry: any) {}

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
