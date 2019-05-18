import { InfoHandler } from "../info";
import { isStringType, isObjectType } from "../util";

export const createRefValidator = config => new RefValidator(config);

export class RefValidator extends InfoHandler {
  constructor(config = {}) {
    super(config);
  }

  validate(reference) {
    !reference && this.error("validate", "Missing reference");
    !isStringType(reference) &&
      this.error(
        "validate",
        `Reference invalid. Must be a string, was: ${typeof reference}`,
        {
          reference
        }
      );
    return true;
  }
}
