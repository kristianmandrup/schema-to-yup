import { NullHandler } from "./handler";

export function toYupNull(obj, config = {}) {
  return obj && new NullHandler(config).handle(obj);
}

export { YupNull } from "./null";
