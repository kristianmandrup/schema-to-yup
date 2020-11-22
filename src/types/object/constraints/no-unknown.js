import { BaseTypeConstraint } from "../../base-type-constraint";

export const noUnknown = (handler, opts) => new NoUnknown(handler, opts)

export class NoUnknown extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { noUnknown, propertyNames } = this.value;
    const names = noUnknown || propertyNames;
    const errMsg = this.valErrMessageOr("propertyNames", "noUnknown")
    return this.chain(x => names && x.noUnknown(names,errMsg))
  }
}