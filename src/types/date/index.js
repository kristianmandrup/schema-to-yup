import { DateConstraint } from "../constraints/date";
import { DateHandler } from "./handler";

export function toYupDate(obj, config = {}) {
  return obj && new DateHandler(config).handle(obj);
}

export * as DateConstraints from './constraints'
export { YupDate } from "./date";
