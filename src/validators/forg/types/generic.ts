import { TypeMatcher } from "../../../type-matcher";
import { Rule } from "@cesium133/forgjs";

export class GenericSchemaEntry extends TypeMatcher {
  type: string = "string";
  entryRuleOpts: any = {};

  constructor(obj) {
    super(obj);
  }

  addRuleOpt(opt = {}) {
    this.entryRuleOpts = {
      ...this.entryRuleOpts,
      ...opt
    };
  }

  get schemaEntry() {
    return this.buildSchemaEntry();
  }

  buildSchemaEntry() {
    return new Rule(this.ruleOpts);
  }

  get ruleOpts() {
    return { ...this.baseRuleOpts, ...this.entryRuleOpts };
  }

  get baseRuleOpts() {
    return { type: this.type };
  }
}
