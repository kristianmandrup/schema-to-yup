import { ArraySchemaEntryWalker } from "./array-walker";
import { util } from "@schema-validator/core";
const { isArray } = util;

export { ArraySchemaEntryWalker };

export function toArray(obj, config = {}) {
  return isArray(obj.type) && ArraySchemaEntryWalker.create(obj, config);
}
