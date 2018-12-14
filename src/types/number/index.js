const { YupMixed } = require("../mixed");
const { createNumberGuard, NumberGuard } = require("./guard");

const proceed = (obj, config = {}) => {
  return createNumberGuard(obj, config).verify();
};

function toYupNumber(obj, config = {}) {
  return proceed(obj, config) && buildYupNumber(obj);
}

function toYupNumberSchemaEntry(obj, config = {}) {
  return proceed(obj, config) && buildSchemaEntry(obj);
}

function buildSchemaEntry(obj) {
  return YupNumber.schemaEntryFor(obj);
}

function buildYupNumber(obj) {
  return YupNumber.create(obj);
}

class YupNumber extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = this.normalizeNumType(obj.type);
    this.validatorTypeApi = this.yup.number();
  }

  normalizeNumType(type) {
    return type === "int" ? "integer" : type;
  }

  static create(obj) {
    return new YupNumber(obj);
  }

  static schemaEntryFor(obj) {
    return YupNumber.create(obj).createSchemaEntry();
  }

  get enabled() {
    return ["range", "posNeg", "integer", "truncate", "round"];
  }

  convert() {
    this.enabled.map(name => this.processConstraint(name));
    super.convert();
    return this;
  }

  processConstraint(name) {
    const fn = this[name];
    fn && typeof fn === "function" ? fn.bind(this)() : fn.add();
  }

  round() {
    const { round } = this.constraints;
    if (this.isNothing(round)) {
      return this;
    }
    const $round = this.isStringType(round) ? round : "round";
    round && this.base.round($round);
    return this;
  }

  get grouped() {
    return {
      posNeg: ["positive", "negative"],
      range: ["moreThan", "lessThan", "max", "min"]
    };
  }

  get constraintsTypeMap() {
    return {
      round: {
        type: "string",
        toArg: val => ({
          type: val
        })
      },
      range: "positive"
    };
  }

  get constraintsMap() {
    return {
      on: ["posNeg", "integer", "truncate", "round"],
      value: ["range"]
    };
  }

  get constraintsCheckMap() {
    return {
      integer: () => this.isIntegerType(this.type)
    };
  }

  // for normalize
  get aliasMap() {
    return {
      max: ["maximum"],
      min: ["minimum"],
      moreThan: ["exclusiveMinimum"],
      lessThan: ["exclusiveMaximum"]
    };
  }
}

module.exports = {
  toYupNumber,
  toYupNumberSchemaEntry,
  YupNumber,
  createNumberGuard,
  NumberGuard
};
