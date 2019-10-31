import { createNumberGuard, NumberGuard } from "./guard";
export { createNumberGuard, NumberGuard };
import { NumberType } from "./number";
export { NumberType };

export const proceed = (obj, config = {}) => {
  return createNumberGuard(obj, config).verify();
};

export function toNumber(obj, config = {}) {
  return proceed(obj, config) && buildNumber(obj);
}

export function buildNumber(obj) {
  return NumberType.create(obj);
}
