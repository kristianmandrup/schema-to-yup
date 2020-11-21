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
    email: Email,
    format: Format,
    lowercase: Lowercase,
    maxLength: MaxLength,
    minLength: MinLength,
    pattern: Pattern,
    trim: Trim,
    uppercase: Uppercase,
    url: Url
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