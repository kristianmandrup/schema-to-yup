import { ArrayHandler } from "./handler";

export function toYupArray(obj, config = {}) {
  return obj && new ArrayHandler(config).handle(obj);
}
