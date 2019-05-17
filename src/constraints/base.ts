import { TypeMatcher } from "../type-matcher";
import { ObjectDef } from "../_types";

const alwaysTrueFn = () => true;
const identity = val => val;

export class Constraint extends TypeMatcher {
  name: string;
  typer: any;
  map: ObjectDef;
  $map: ObjectDef = {};
  errorMsg: string;
  constraints: ObjectDef = {};
  checkValue: (value: any) => boolean;

  constructor(typer, { name, value, errorMsg, checkValue, constraints }) {
    super(typer.config);
    this.typer = typer;
    this.map = this.mapFor(value);
    this.constraints = constraints || {};
    this.errorMsg = errorMsg || "";
    this.checkValue = checkValue || alwaysTrueFn;
    this.typer = typer;
    this.name = name;
  }

  mapFor(value) {
    if (!value) return this.$map || {};
    if (this.isStringType(value)) return { [value]: value };
    if (this.isArrayType(value))
      return value.reduce((acc, key) => {
        acc[key] = { [value]: value };
        return acc;
      }, {});
    return value;
  }

  isStringType(val) {
    return typeof val === "string";
  }

  get delegates() {
    return ["constraints", "applyConstraintToValidator"];
  }

  add() {
    const $map = this.map;
    const mapKeys = Object.keys($map);
    mapKeys.map(yupMethod => {
      const names = this.namesFor(yupMethod);
      this.processConstraints(yupMethod, names);
    });
  }

  namesFor(yupMethod): string[] {
    const entry = this.map[yupMethod];
    const names = this.entryNames(entry);
    return [yupMethod, ...names];
  }

  entryNames(entry) {
    return this.isArrayType(entry) ? entry : [entry];
  }

  processConstraints(method, names: string[] = []) {
    names.map(name => {
      const value = this.validateAndTransform(name);
      if (value) {
        this.applyConstraintToValidator(name, value, method);
      }
    });
    return this;
  }

  // TODO: call validator
  applyConstraintToValidator(name, value, method) {}

  validateAndTransform(name) {
    const cv = this.constraintFor(name);
    if (this.isNothing(cv)) {
      return null;
    }
    this.validate(cv);
    return this.transform(cv);
  }

  // override
  transform(value) {
    return value;
  }

  constraintFor(name) {
    return this.constraints[name];
  }

  invalidMsg(value) {
    return `invalid constraint for ${this.name}, was ${value}.`;
  }

  get explainConstraintValidMsg() {
    return this.errorMsg;
  }

  invalidConstraintMsg(value) {
    const msg = [this.invalidMsg(value), this.explainConstraintValidMsg].join(
      "\n"
    );
    return this.errorMsg ? [msg, this.errorMsg].join(" ") : msg;
  }

  validate(value) {
    if (this.isNothing(value)) {
      return this;
    }
    if (!this.isValidConstraintValue(value)) {
      return this.handleInvalidConstraint(value);
    }
  }

  // override
  isValidConstraintValue(value) {
    return true;
  }

  handleInvalidConstraint(value) {
    const msg = this.invalidConstraintMsg(value);
    if (this.warnOnInvalid) {
      this.warn(msg, value);
      return this;
    }
    this.error(msg, value);
    return this;
  }
}
