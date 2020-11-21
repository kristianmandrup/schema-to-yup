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
    const $round = typeMatcher.isStringType(round) ? round : "round";
    round && this.base.round($round);
    return this;
  }
}