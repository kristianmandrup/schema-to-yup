import { IsType } from './is-type'
import { Label } from './label'
import { OneOf } from './one-of'
import { NotOneOf } from './not-one-of'
import { Nullable } from './nullable'
import { When } from './when'

import { BaseTypeConstraintsProcessor } from '../../base-type-constraints-processor'

export const constraints = {
  classMap: {
    IsType,
    Label,    
    OneOf,
    NotOneOf,
    Nullable,
    When
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