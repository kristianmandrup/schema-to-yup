import * as yup from "yup";
import { Loggable, util } from "@schema-validator/core";
const { isObjectType } = util;

type YupApiMethod = "mixed " | "string" | "date";

type ApiDef = {
  [key: string]: Function;
};

export class YupBuilder extends Loggable {
  type: YupApiMethod;
  api: ApiDef;
  methodArgs: any[];

  constructor(yupMethodArgs: any[], config: any = {}) {
    super(config);
    this.type = config.type || "mixed";
    this.api = yup[this.type]();
    this.methodArgs = yupMethodArgs;
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
}
