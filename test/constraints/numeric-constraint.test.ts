import { createNumericConstraint } from "./_imports";

const isNumber = val => !isNaN(val) && typeof val === "number";

interface ITyper {
  isNumberLike: any;
  constraints: any;
  applyConstraintToValidator: (opts: any) => void;
  toNumber: (val: any) => any;
}

describe("createNumericConstraint", () => {
  const value = {
    max: ["maximum", "max"],
    min: ["minimum", "min"]
  };
  const opts = {
    value
  };
  const typer: ITyper = {
    isNumberLike: null,
    constraints: {
      type: "number"
    },
    applyConstraintToValidator: ({ name, value, method }) => true,
    toNumber: val => Number(val)
  };
  typer.isNumberLike = val => !isNaN(typer.toNumber(val));

  describe("instance", () => {
    const constraint = createNumericConstraint(typer, opts);
    test("map", () => {
      expect(constraint.map).toBe(value);
    });

    describe("isValidConstraintValue", () => {
      test("valid number string - number", () => {
        expect(constraint.isValidConstraintValue("12")).toBeTruthy();
      });

      test("invalid string - throws", () => {
        expect(constraint.isValidConstraintValue("xa")).toBeFalsy();
      });

      test("integer - Number", () => {
        expect(constraint.isValidConstraintValue(1)).toBeTruthy();
      });
    });

    describe("toNumber", () => {
      test("valid number string - number", () => {
        const val = constraint.toNumber("12");
        expect(typeof val === "number").toBeTruthy();
      });

      test("number - number", () => {
        expect(isNumber(constraint.toNumber(1))).toBeTruthy();
      });
    });

    describe("transform", () => {
      test("valid number string - number", () => {
        const val = constraint.transform("12");
        expect(isNumber(val)).toBeTruthy();
      });

      test("invalid date string - throws", () => {
        const nan = constraint.transform("xa");
        expect(isNumber(nan)).toBeFalsy();
      });

      test("integer - Date", () => {
        expect(isNumber(constraint.transform(1))).toBeTruthy();
      });
    });
  });
});
