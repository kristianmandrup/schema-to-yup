import { classify } from "@schema-validator/core";

type VoidEntryFn = (entry: any) => void

export interface ISchemaEntryWalker {
  walk: VoidEntryFn
  onEnterEntry: VoidEntryFn
  onExitEntry: VoidEntryFn
}

export class SchemaEntryWalker implements ISchemaEntryWalker {
  _entry: any
  listeners: any[]

  constructor(config: any = {}) {
    this.listeners = config.listeners
  }

  init() {}

  walkEntry(entry: any) {
    this.onEnterEntry(entry)
    this.entry = entry
    this.walk(entry)
    this.onExitEntry(entry)
  }

  get entry() {
    return this._entry
  }

  set entry(entry) {
    this._entry = entry
  }

  get children() {
    return []
  }

  walk(entry: any) { 
  }

  onEnterEntry(entry: any) {
    this.genericOnEntry(entry, 'Enter')
  }

  onExitEntry(entry: any) {
    this.genericOnEntry(entry, 'Exit')
  }

  genericOnEntry(entry: any, lifecycle: string = 'Enter') {
    const { type } = entry
    const methodName = this.methodName(type, lifecycle)
    this.listeners.map(listener => {
      const eventHandler = listener[]
    })    
  }

  methodName(type: string, lifecycle: string) {
    type = classify(type)
    return `on${lifecycle}${type}`
  }
}