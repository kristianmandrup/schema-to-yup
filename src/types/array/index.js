import { ArrayHandler } from "./handler";

export function toYupArray(obj, config = {}) {
  return obj && new ArrayHandler(config).handle(obj);
}

export { YupArray } from "./array";
export * as ArrayConstraints from './constraints'
