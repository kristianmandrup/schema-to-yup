import { BaseInstanceBuilder } from "../base/builder";

export function buildInstance(schema, config = {}) {
  return new InstanceBuilder(schema, config).yupSchema;
}

export class InstanceBuilder extends BaseInstanceBuilder {
  get form() {
    return yup.object();
  }
}
