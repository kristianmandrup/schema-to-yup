export const propsToMapping = (
  { parentName, properties },
  config: any = {}
) => {
  const { propToSchemaEntry } = config;
  const propKeys = Object.keys(properties);
  return propKeys.reduce((acc, key) => {
    const value = properties[key];
    acc[key] = propToSchemaEntry({ parentName, key, value }, config);
    return acc;
  }, {});
};
