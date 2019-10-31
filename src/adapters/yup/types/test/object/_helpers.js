import { types, buildYup } from "../../../src";
import { createObjectHandler } from "../../../src/types/object/handler";
const { toYupObject } = types;
const yup = require("yup");

const isObject = fieldDef => fieldDef && fieldDef.type === "object";
const config = { isObject };

export { buildYup, createObjectHandler };

export const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupObject(obj, config);
};

export const createObject = value => {
  const obj = { value, config, key: "x", type: "object" };
  return toYupObject(obj, config);
};

export const createObjectNoKey = value => {
  const obj = { value, config, type: "object" };
  return toYupObject(obj, config);
};

export const dogSchema = {
  type: "object",
  title: "Dog",
  properties: {
    name: {
      type: "string"
    },
    age: {
      type: "number"
    }
  }
};

export const schema = {
  type: "object",
  title: "Person",
  properties: {
    name: {
      type: "string"
    },
    dog: dogSchema
  },
  required: ["name"]
};
