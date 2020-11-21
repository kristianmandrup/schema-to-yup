import { ItemsOf, itemsOf } from './items-of'
import { Compact, compact } from './compact'
import { EnsureItems, ensureItems } from './ensure-items'
import { MaxItems, maxItems } from './max-items'
import { MinItems, minItems } from './min-items'

export const factories = {
  itemsOf,
  compact,
  ensureItems,
  maxItems,
  minItems
}

export const classMap = {
  ItemsOf,
  Compact,
  EnsureItems,
  MaxItems,
  MinItems
}

export const constraints = {
  classMap: {
    itemOf: ItemsOf,
    compact: Compact,
    ensureItems: EnsureItems,
    maxItems: MaxItems,
    minItems: MinItems
  }
}
