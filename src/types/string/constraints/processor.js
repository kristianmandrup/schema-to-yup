import { BaseTypeConstraintsProcessor } from '../../base-type-constraints-processor'
import { factories, classMap, constraints } from './maps'

export class StringConstraintsProcessor extends BaseTypeConstraintsProcessor {
  constructor(opts = {}) {
    super(opts)
  }

  maps() {
    return {
      factories, 
      classMap, 
      constraints
    }
  }
}