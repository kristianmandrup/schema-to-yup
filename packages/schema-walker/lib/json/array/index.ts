import { ArraySchemaEntryWalker } from "./array-walker";
export { ArraySchemaEntryWalker };

export function toArray(obj) {
  return Array.isArray(obj.type) && ArraySchemaEntryWalker.create(obj).convert();
}
