import { ObjectHandler, createObjectHandler } from "./handler";

export function toYupObject(obj, config = {}) {
  return obj && createObjectHandler(config).handle(obj);
}

export { ObjectHandler };
export { YupObject } from "./object";
