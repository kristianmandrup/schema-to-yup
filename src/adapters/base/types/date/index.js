import { DateHandler } from "./handler";

export function toYupDate(obj, config = {}) {
  return obj && new DateHandler(config).handle(obj);
}

export { YupDate } from "./date";
