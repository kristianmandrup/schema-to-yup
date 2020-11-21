import { StringHandler } from "./handler";
export * as StringConstraints from './constraints'

export function toYupString(obj, config = {}) {
  return obj && new StringHandler(config).handle(obj);
}

export { YupString } from "./string";


