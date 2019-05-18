import { buildConfig } from "./build-config";
export { buildConfig };

export const build = (schema: any, config: any = {}) => {
  const { onComplete, onThrow } = config;
  try {
    config = buildConfig(config, schema);
    const properties = config.buildProperties(schema, config);
    const results = config.result;
    onComplete && onComplete(results);
    return {
      properties,
      results
    };
  } catch (err) {
    onThrow && onThrow(err);
    throw err;
  }
};
