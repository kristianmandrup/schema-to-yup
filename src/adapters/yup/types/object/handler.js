import { YupObject } from "./object";

const isObject = fieldDef => fieldDef && fieldDef.type === "object";

export class ObjectHandler {
  constructor(config = {}) {
    config = config || {};
    config.isObject = config.isObject || isObject;
    this.config = config;
    this.schema = config.schema;
  }

  isObject(obj) {
    return this.config.isObject(obj.value);
  }

  handle(obj) {
    return (
      this.isObject(obj) &&
      YupObject.create({ ...obj, config: this.config }).createSchemaEntry()
    );
  }
}

export function createObjectHandler(config = {}) {
  return new ObjectHandler(config);
}
