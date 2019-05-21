import yup from "yup";
import { Loggable } from "@schema-validator/core";

type YupApiMethod = "mixed " | "string" | "date";

type ApiDef = {
  [key: string]: Function;
};

export class YupBuilder extends Loggable {
  type: YupApiMethod;
  api: ApiDef;
  _shape: any;

  constructor(shape: any, config: any = {}) {
    super(config);
    this._shape = shape;
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
    return this._shape;
  }

  get schema() {
    return this.object.shape(this._shape);
  }

  get object() {
    return yup.object();
  }
}
