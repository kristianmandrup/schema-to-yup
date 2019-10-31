import { Loggable } from "../../_loggable";

export class ConstraintCreator extends Loggable {
  constructor(options = {}) {
    this.init(options);
  }

  init(options) {
    if (!options) return;
    const {
      constraintName,
      constraintMethodName,
      propertyName,
      constraintValue,
      typeConstrainerInst
    } = options;
    this.options = options;
    this.typeConstrainerInst = typeConstrainerInst;
    this.constraintName = constraintName;
    this.propertyName = propertyName;
    this.constraintValue = constraintValue;
    this.constraintMethodName =
      constraintMethodName || propertyName || constraintName;
  }

  get constraintValueHandlerNames() {
    return [
      "constraintWithValues",
      "constraintWithSingleValue",
      "constraintWithNoValue"
    ];
  }

  constraintValueHandlerFnFor(name) {
    return this[name];
  }

  create(options) {
    this.init(options);
    const constraintOpts = this.createConstraintOpts(this.options);
    const { constraintValue } = this;
    if (!constraintValue) {
      this.error("Missing constraintValue");
    }

    for (let name of this.constraintValueHandlerNames) {
      const handlerFn = this.constraintValueHandlerFnFor(name);
      const result = handlerFn(constraintValue, constraintOpts);
      if (result) return result;
    }
    return;
  }
}
