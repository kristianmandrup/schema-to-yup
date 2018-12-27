import yup from "yup";
import { Builder } from "../base/builder";
export { extendYupApi } from "./validator-bridge";

function buildSchema(schema, config = {}) {
  return new YupBuilder(schema, config).validatorSchema;
}

export class YupBuilder extends Builder {
  constructor(schema, config = {}) {
    super(schema, config);
  }

  get validatorSchema() {
    return yup.object().shape(this.shapeConfig);
  }
}
