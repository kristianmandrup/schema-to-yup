import { Validator, Rule } from "@cesium133/forgjs";
import { Loggable } from "..";

export class ForgValidator extends Loggable {
  validator: any;
  constructor(config = {}) {
    super(config);
  }

  buildValidator() {
    this.validator = new Validator({
      age: new Rule({ type: "int", min: 18, max: 99 }),
      dateOfBirth: new Rule({ type: "date" }),
      array: new Rule({ type: "array", of: new Rule({ type: "string" }) })
      // email: emailRule
      // pasword: passwordRule
    });
    return this.validator;
  }

  toArg() {}
}

export class RuleFactory {
  rule() {
    return {
      email: def => {
        new Rule(
          {
            type: email,
            ...def
          },
          null
        );
      }
    };
  }
}
