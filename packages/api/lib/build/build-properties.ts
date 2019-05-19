import { isObject, isFunction, camelcase } from "@schema-validator/core";

const error = (msg, data) => {
  data ? console.error(msg, data) : console.error(msg);
  throw new Error(msg);
};

const defaults = {
  error
};

export const buildProperties = (schema, config: any = {}) => {
  let { type, properties } = schema;
  const error = config.error || defaults.error;

  const { normalizeRequired, processProps } = config;
  if (!isFunction(normalizeRequired)) {
    error("missing normalizeRequired function in config", config);
  }
  if (!isFunction(processProps)) {
    error("missing processProps function in config", config);
  }

  if (!isObject(schema)) {
    error(`invalid schema: type must be object, was: ${type}`, type);
  }
  if (!properties) {
    error(`invalid schema, missing properties`, { schema, properties });
  }
  properties = normalizeRequired(schema);
  const $parentName =
    schema.name || schema.parentName || schema.title || config.name;

  const parentName = $parentName ? camelcase($parentName, true) : "";

  const processedProps = processProps({ parentName, properties }, config);
  if (schema.parentName || config.nested) {
    return {
      type: "object",
      properties: {
        ...processedProps
      }
    };
  }
  return processedProps;
};
