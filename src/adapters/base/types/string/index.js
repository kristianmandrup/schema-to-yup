import { StringHandler } from "./handler";

export const stringType = (obj, config = {}) => {
  return obj && new StringHandler(config).handle(obj);
};

export { StringType } from "./string";
