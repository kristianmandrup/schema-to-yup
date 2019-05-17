import { YupBuilder } from "./yup-builder";
export { YupBuilder };

export function buildYup(schema, config = {}) {
  return new YupBuilder(schema, config).yupSchema;
}
