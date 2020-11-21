import { BaseTypeConstraint } from "../../base-type-constraint";

export const noUnknown = (handler, opts) => new NoUnknown(handler, opts)

export class NoUnknown extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    const { noUnknown, propertyNames } = this.value;
    const $names = noUnknown || propertyNames;
    const newBase =
      $names &&
      this.base.noUnknown(
        $names,
        this.valErrMessage("propertyNames") || this.valErrMessage("noUnknown")
      );
    this.base = newBase || this.base;
    return this;
  }
}