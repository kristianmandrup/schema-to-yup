import { createWhenCondition } from "../../conditions";
import { Loggable } from "../../../../_loggable";

export class WhenCondition extends Loggable {
  constructor(typeInst) {
    this.typeInst = typeInst;
  }

  get delegators() {
    return [
      "key",
      "type",
      "value",
      "schema",
      "properties",
      "config",
      "constraints"
    ];
  }

  delegate() {
    this.delegators.map(name => (this[name] = typeInst[name]));
  }

  create(when) {
    const opts = {
      key: this.key,
      type: this.type,
      value: this.value,
      schema: this.schema,
      properties: this.properties,
      config: this.config,
      when
    };
    return createWhenCondition(opts);
  }

  when() {
    const when = this.constraints.when;
    if (!isObjectType(when)) return this;
    const { constraint } = this.createWhenConditionFor(when);

    if (!constraint) {
      this.warn(`Invalid when constraint for: ${when}`);
      return this;
    } else {
      this.logInfo(`Adding when constraint for ${this.key}`, constraint);
      // use buildConstraint or addConstraint to add when constraint (to this.base)

      this.addConstraint("when", { values: constraint, errName: "when" });
    }
    return this;
  }
}
