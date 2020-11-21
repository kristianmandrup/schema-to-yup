import { BaseTypeConstraint } from "../../base-type-constraint";
import { createRangeConstraint } from "./range-constraint";

export const range = (handler, opts) => new Range(handler, opts)

export class Range extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
    this.rangeConstraint = createRangeConstraint(this);
  }

  process() {
    this.rangeConstraint.add();
  }
}
