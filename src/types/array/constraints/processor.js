import { ItemsOf } from './items-of'
import { Compact } from './compact'
import { EnsureItems } from './ensure-items'
import { MaxItems } from './max-items'
import { MinItems } from './max-items'
import { BaseTypeConstraintsProcessor } from '../../base-type-constraints-processor'

export const constraints = {
  classMap: {
    itemOf: ItemsOf,
    compact: Compact,
    ensureItems: EnsureItems,
    maxItems: MaxItems,
    minItems: MinItems
  }
}

export class DateConstraintsProcessor extends BaseTypeConstraintsProcessor {
  constructor(opts = {}) {
    super(opts)
  }

  init() {
    this.constraintsMap = {
      ...constraints.classMap,
      ...this.opts.constraintsMap || {},      
    }
  }
}