import { ObjectHandler } from "./handler";

export function toYupObject(obj, config = {}) {
  return obj && new ObjectHandler(config).handle(obj);
}

export { ObjectHandler };
