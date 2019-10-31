function isObjectType(obj) {
  return obj === Object(obj);
}
import { TypeHelper } from "../type-helper";

export class BaseType extends AbstractType {
  constructor(opts = {}, config) {
    super(opts.config || config);
    this.init(opts);
  }

  init(opts) {
    let { schema, key, value, config } = opts;
    config = config || {};
    schema = schema || {};

    this.validateOnCreate(key, value, opts);

    this.typeInst = opts.typeInst;
    this.key = key;
    this.schema = schema;
    this.properties = schema.properties || {};
    this.value = value;
    this.constraints = this.getConstraints();
    this.format = value.format || this.constraints.format;
    this.config = config || {};
    this.type = "mixed";

    this.constraintsAdded = {};

    // from abstract
    this.constraintBuilder = this.createConstraintBuilder({
      constraints: this.constraints,
      base: this.base
    });

    // rebind: ensure this always mapped correctly no matter context
    this.rebind("addConstraint", "addValueConstraint");
  }

  visit(visitor) {
    visitor.notify(this);
  }

  get typeInst() {
    throw "Not implemented";
  }

  convert() {
    return this;
  }

  get constraintsMap() {
    return {};
  }
}
