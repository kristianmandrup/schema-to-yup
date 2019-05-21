import { createSchemaEntry } from "./create-schema-entry";

export const propToSchemaEntry = (obj, config: any = {}) => {
  const entryBuilder = createSchemaEntry || config.createSchemaEntry;
  return entryBuilder(obj, config);
};
