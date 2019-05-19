import { InfoHandler } from "../info";
import { isObjectType } from "../util";

export const createSchemaValidator = (config = {}) =>
  new SchemaValidator(config);

export class SchemaValidator extends InfoHandler {
  constructor(config = {}) {
    super(config);
  }

  validate(schema?: any) {
    !schema && this.error("validate", "Missing schema", { schema });
    !isObjectType(schema) &&
      this.error(
        "validate",
        `Invalid schema. Must be an Object, was: ${typeof schema}`
      );
    return true;
  }
}
