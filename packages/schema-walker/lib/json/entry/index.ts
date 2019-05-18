type VoidEntryFn: (entry: any) => void

export interface ISchemaEntryWalker {
  walk: VoidEntryFn
  onEnterEntry: VoidEntryFn
  onExitEntry: VoidEntryFn
}

export class SchemaEntryWalker implements ISchemaEntryWalker {
  walk(entry: any) {

  }

  onEnterEntry() {

  }

  onExitEntry() {
    
  }
}