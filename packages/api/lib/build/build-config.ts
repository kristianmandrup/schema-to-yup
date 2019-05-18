import { normalizeRequired } from "./normalize-required";
import { buildProperties } from "./build-properties";
import { propsToMapping } from "./props-to-mapping";
import { propToSchemaEntry } from "./prop-to-schema-entry";

export const buildConfig = (config = {}, schema = {}) => {
  const builtConfig = {
    schema,
    resultObj: {},
    normalizeRequired,
    buildProperties,
    propsToMapping,
    propToSchemaEntry,
    itemResolver: propToSchemaEntry,
    ...config
  };
  return builtConfig;
};
