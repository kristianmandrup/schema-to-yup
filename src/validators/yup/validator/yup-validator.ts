import { Loggable } from "../../../loggable";

type YupApiMethod = "mixed " | "string" | "date";

type ApiDef = {
  [key: string]: Function;
};

export class YupValidator extends Loggable {
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
}
