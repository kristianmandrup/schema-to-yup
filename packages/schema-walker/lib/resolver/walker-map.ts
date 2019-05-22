export const createSchemaTypeWalkerMap = config => {
  const {
    createObjectSchemaEntryWalker,
    createArraySchemaEntryWalker,
    createPrimitiveSchemaEntryWalker
  } = config;

  return {
    object: opts => createObjectSchemaEntryWalker(opts, config),
    array: opts => createArraySchemaEntryWalker(opts, config),
    primitive: opts => createPrimitiveSchemaEntryWalker(opts, config)
  };
};
