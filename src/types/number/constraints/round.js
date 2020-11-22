import { BaseTypeConstraint } from "../../base-type-constraint";
import { typeMatcher } from '../../_type-matcher'

export const round = (handler, opts) => new Round(handler, opts)

export class Round extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { round } = this.constraints;
    if (typeMatcher.isNothing(round)) {
      return this;
    }
    const roundLabel = typeMatcher.isStringType(round) ? round : "round";
    return this.chain(x => roundLabel && x.round(roundLabel));
  }
}