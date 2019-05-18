import yup from "yup";
import { Loggable } from "@schema-validator/core";

type YupApiMethod = "mixed " | "string" | "date";

type ApiDef = {
  [key: string]: Function;
};

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

  get shape() {
    return {};
  }

  get instance() {
    return this.object.shape(this.shape);
  }

  get object() {
    return yup.object();
  }
}
