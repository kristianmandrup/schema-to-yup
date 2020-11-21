import { BaseTypeConstraint } from "../../base-type-constraint";

export const recursive = (handler, opts) => new Recursive(handler, opts)

export class Recursive extends BaseTypeConstraint {
  constructor(handler, opts = {}) {
    super(handler, opts)
  }

  process() {
    // this.initHelpers();
    // this.convertEnabled();

    const schema = this.value;
    const config = this.config;

    // recursive definition
    if (schema) {
      if (!config.buildYup) {
        this.error("convert", "Missing buildYup function from config", config);
      }

      const yupSchema = this.config.buildYup(schema, config);
      this.base = yupSchema;
    }

  }
}