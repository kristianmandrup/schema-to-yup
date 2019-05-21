import { normalizeRequired } from "@schema-validator/schema-resolver";
// import { walkSchema } from "./build-properties";

export const buildConfig = (config = {}, schema = {}) => {
  const builtConfig = {
    schema,
    resultObj: {},
    normalizeRequired,
    // walkSchema,
    // walker
    // propsToMapping,
    // propToSchemaEntry,
    // itemResolver: propToSchemaEntry,
    ...config
  };
  return builtConfig;
};
