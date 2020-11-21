import { Integer } from './integer'
import { Positive } from './positive'
import { Negative } from './negative'
import { Round } from './round'
import { Range } from './range'
import { Truncate } from './truncate'
import { BaseTypeConstraintsProcessor } from '../../base-type-constraints-processor'

export const constraints = {
  classMap: {
    integer: Integer,
    positive: Positive,
    negative: Negative,
    round: Round,
    range: Range,
    truncate: Truncate
  }
}

export class MixedConstraintsProcessor extends BaseTypeConstraintsProcessor {
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