import { Loggable } from "@schema-validator/core";

export function buildValidator(schema, config = {}) {
  return new ValidatorBuilder(schema, config).instance;
}

export class ValidatorBuilder extends Loggable {
  schema: any;
  type: any;

  constructor(schema, config = {}) {
    super(config);
    this.schema = schema;
    // const type = this.getType(schema);
  }

  walker(): any {
    return {};
  }

  build() {
    this.walker.walk(schema, config);
    return this.instance;
  }

  // TODO: return .instance of Validator built (see)
  get instance() {
    return {};
    //
  }
}
