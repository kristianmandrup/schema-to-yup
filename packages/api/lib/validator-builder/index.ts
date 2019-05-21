import { Loggable } from "@schema-validator/core";

interface IWalker {
  walk: (schema: any) => void;
}

export function buildValidator(schema, config = {}) {
  return new ValidatorBuilder(schema, config).instance;
}

export class ValidatorBuilder extends Loggable {
  schema: any;
  type: any;
  schemaWalker: IWalker;

  constructor(schema, config: any = {}) {
    super(config);
    this.schema = schema;
    this.schemaWalker = config.schemaWalker;
    // const type = this.getType(schema);
  }

  get walker(): IWalker {
    return this.schemaWalker;
  }

  build() {
    this.walker.walk(this.schema);
    return this.instance;
  }

  // return .instance of Validator built (see)
  get instance() {
    return {};
  }
}
