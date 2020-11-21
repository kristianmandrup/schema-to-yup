import { BaseTypeConstraint } from "../../base-type-constraint";
import { createRangeConstraint } from "./range-constraint";

export const range = (opts) => new Range(opts)

export class Range extends BaseTypeConstraint {
  constructor(opts = {}) {
    super(opts)
    this.rangeConstraint = createRangeConstraint(this);
  }

  process() {
    this.rangeConstraint.add();
  }
}
