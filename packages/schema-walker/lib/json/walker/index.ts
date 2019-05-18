import { SchemaWalker } from "./schema-walker";
export { SchemaWalker };

export function buildWalker(schema, config = {}) {
  return new SchemaWalker(schema, config).instance;
}
