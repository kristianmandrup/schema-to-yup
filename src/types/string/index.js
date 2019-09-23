import { StringHandler } from "./handler";

export function toYupString(obj, config = {}) {
  return obj && new StringHandler(config).handle(obj);
}
