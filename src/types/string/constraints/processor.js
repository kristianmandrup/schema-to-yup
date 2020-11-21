import { Email } from './email'
import { Format } from './format'
import { Lowercase } from './lowercase'
import { MaxLength } from './max-length'
import { MinLength } from './min-length'
import { Pattern } from './pattern'
import { Trim } from './trim'
import { Uppercase } from './uppercase'
import { Url } from './url'

import { BaseTypeConstraintsProcessor } from '../../base-type-constraints-processor'

export const constraints = {
  classMap: {
    Email,
    Format,
    Lowercase,
    MaxLength,
    MinLength,
    Pattern,
    Trim,
    Uppercase,
    Url
  }
}

export class StringConstraintsProcessor extends BaseTypeConstraintsProcessor {
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