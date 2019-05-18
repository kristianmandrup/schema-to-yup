import { classify } from "@schema-validator/core";

type VoidEntryFn: (entry: any) => void

export interface ISchemaEntryWalker {
  walk: VoidEntryFn
  onEnterEntry: VoidEntryFn
  onExitEntry: VoidEntryFn
}

export class SchemaEntryWalker implements ISchemaEntryWalker {
  constructor(config: any = {}) {
    this.listeners = config.listeners
  }

  walkEntry(entry: any) {
    this.onEnterEntry(entry)
    this.walk(entry)
    this.onExitEntry(entry)
  }

  onEnterEntry(entry: any) {
    this.genericOnEntry(entry, 'Enter')
  }

  onEnterEntry(entry: any) {
    this.genericOnEntry(entry, 'Exit')
  }

  genericOnEntry(entry: any, lifecycle: string = 'Enter') {
    const { type } = entry
    const methodName = this.methodName(type, lifecycle)
    this.listeners.map(listener => {
      const eventHandler = listener[]
    })    
  }

  methodName(type: string) {
    type = classify(type)
    return `on${lifecycle}${type}`
  }
}