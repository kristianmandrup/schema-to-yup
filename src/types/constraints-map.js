import { StringConstraints } from './string'
import { NumberConstraints } from './number'
import { MixedConstraints } from './mixed'
import { ObjectConstraints } from './object'
import { DateConstraints } from './date'
import { ArrayConstraints } from './array'

// new constraintsMap.string.Processor(handler, opts)

export const constraintsMap = {
  mixed: MixedConstraints,
  string: StringConstraints,
  number: NumberConstraints,
  object: ObjectConstraints,
  date: DateConstraints,
  array: ArrayConstraints
}