import { createWhenEntry } from "../../lib/conditional/when-entry";
import { createSchemaEntry } from "../../lib/create-entry";
import { inquiry } from "@schema-validator/core";
const defaults = inquiry;
import * as yup from "yup";
export { yup, createWhenEntry };

export const schema = {
  title: "user",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    count: {
      type: "number",
      when: {
        name: {
          is: true,
          then: "required"
        }
      }
    }
  }
};

export const properties = schema.properties;
const countObj = properties.count;

export const config = {
  createSchemaEntry,
  ...defaults["json-schema"]
};

export const type = "number";
export const key = "count";
const keys = Object.keys(countObj.when);

// console.log({ config });

const whenObj = {
  schema,
  properties,
  type,
  key,
  // keys,
  value: countObj,
  when: countObj.when,
  config
};

const whenEntryObj = {
  key: "count",
  is: true,
  then: "required"
};

export const whenEntry: any = createWhenEntry(whenEntryObj, whenObj);
