import * as yup from "yup";
import { Loggable, util } from "@schema-validator/core";
// const { isObjectType } = util;

type YupApiMethod = "mixed " | "string" | "date";

type ApiDef = {
  [key: string]: Function;
};

export const createBuilder = (config: any) => new YupBuilder();

export class YupBuilder extends Loggable {
  type: YupApiMethod;
  api: ApiDef;

  constructor(config: any = {}) {
    super(config);
    this.type = config.type || "mixed";
    this.api = yup[this.type]();
  }

  toArg() {}

  get argMap() {
    return {
      round: (val: string) => ({ type: val })
    };
  }

  get object() {
    return yup.object();
  }

  build() {
    // TODO
    return {};
  }
}
