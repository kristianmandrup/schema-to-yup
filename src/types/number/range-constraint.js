import { NumericConstraint } from '../constraints/numeric';

function createRangeConstraint(typer) {
  return new RangeConstraint(typer);
}

class RangeConstraint extends NumericConstraint {
  constructor(typer) {
    super(typer);
  }

  get $map() {
    return {
      moreThan: ["exclusiveMinimum", "moreThan"],
      lessThan: ["exclusiveMaximum", "lessThan"],
      max: ["maximum", "max"],
      min: ["minimum", "min"]
    };
  }
}

export {
  createRangeConstraint,
  RangeConstraint
};
