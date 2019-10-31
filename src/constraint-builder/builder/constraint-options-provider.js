import { Loggable } from "../../_loggable";
import { TypeConstraintMethodMapper } from "./type-constraint-method-mapper";

export class ConstraintOptionsProvider extends Loggable {
  constructor() {
    this.typeConstraintMethodMapper = this.createTypeConstraintMethodMapper();
  }

  createTypeConstraintMethodMapper() {
    return new TypeConstraintMethodMapper();
  }

  getTypeConstrainerMethodName(name) {
    return this.typeConstraintMethodMapper.methodNameFor(name);
  }

  createOptsFor(opts = {}) {
    const { constraintName, errorName, type } = opts;
    let { constraintMethodName } = opts;

    constraintMethodName = this.getTypeConstrainerMethodName(
      constraintMethodName || constraintName
    );

    const typeConstrainerInst =
      opts.typeConstrainerInst || this.typeConstrainerInst;

    const constraintFn = contraintFnFor({
      typeConstrainerInst,
      constraintMethodName,
      ...opts
    });

    const errorFn = this.createErrorFn({ constraintName, errorName });

    return {
      constraintFn,
      errorFn,
      constraintName,
      constraintMethodName,
      type
    };
  }
}
