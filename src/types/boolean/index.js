import { BooleanHandler } from "./handler";

export function toYupBoolean(obj, config = {}) {
  return obj && new BooleanHandler(config).handle(obj);
}
