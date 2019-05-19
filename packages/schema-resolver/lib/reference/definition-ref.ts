// for resolving a type definition reference
import { InfoHandler } from "../info";
import { createReference } from "./reference";
import { createRefValidator } from "./ref-validator";
import { createSchemaValidator } from "./schema-validator";

export const createDefinitionRefResolver = (opts = {}, config) => {
  return new DefinitionRefResolver(opts, config);
};

export class DefinitionRefResolver extends InfoHandler {
  schemaValidator: any; // ISchemaValidator
  refValidator: any; // IRefValidator
  visitedPaths: string[];
  ref: any; // IReference

  protected _schema: any;

  constructor(opts: any, config: any = {}) {
    super(config);
    const { schema } = opts;
    this.schemaValidator = createSchemaValidator(config);
    this.refValidator = createRefValidator(config);
    this.visitedPaths = config.visitedPaths || {};
    const $schema = schema || config.schema;
    this.schema = $schema;
  }

  set schema(schema) {
    this.validateSchema(schema);
    this._schema = schema;
  }

  get schema() {
    return this._schema;
  }

  get wasCacheHit() {
    if (!this.ref) {
      this.error(
        "wasCacheHit",
        "No reference has been resolved. Call refObjectFor(reference)"
      );
    }
    return this.ref.wasCacheHit;
  }

  refObjectFor(reference) {
    this.validateRef(reference);
    this.ref = createReference({ reference, schema: this.schema }, this.config);
    return this.ref.refObject;
  }

  validateSchema(schema) {
    this.schemaValidator.validate(schema);
  }

  validateRef(ref) {
    this.refValidator.validate(ref);
  }
}
