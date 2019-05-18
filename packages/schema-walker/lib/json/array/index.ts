import { ArraySchemaEntryWalker } from "./array";
import { isArray } from "../util";

export function toArray(obj) {
  return isArray(obj.type) && ArraySchemaEntryWalker.create(obj).convert();
}
