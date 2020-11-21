import { CamelCase } from './camel-case'
import { ConstantCase } from './constant-case'
import { NoUnknown } from './no-unknown'
import { Recursive } from './recursive'

import { BaseTypeConstraintsProcessor } from '../../base-type-constraints-processor'

export const constraints = {
  classMap: {
    CamelCase,
    ConstantCase,
    NoUnknown,
    Recursive
  }
}

export class ObjectConstraintsProcessor extends BaseTypeConstraintsProcessor {
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