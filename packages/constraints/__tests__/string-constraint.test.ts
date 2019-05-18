import { createStringConstraint } from "./_imports";

const isString = val => typeof val === "string";
describe("createStringConstraint", () => {
  const round = "round";
  const opts = {
    value: round
  };
  const typer = {
    constraints: {
      type: "string"
    },
    applyConstraintToValidator: (name, value, method) => true,
    toString: val => String(val)
  };
  const constraint = createStringConstraint(typer, opts);

  describe("instance", () => {
    test("map", () => {
      expect(constraint.map).toEqual({ round });
    });

    describe("isValidConstraintValue", () => {
      test("string - true", () => {
        expect(constraint.isValidConstraintValue("12")).toBeTruthy();
      });

      test("number - true", () => {
        expect(constraint.isValidConstraintValue(14)).toBeTruthy();
      });

      test("RegExp - false", () => {
        expect(constraint.isValidConstraintValue(new RegExp("x"))).toBeFalsy();
      });

      test("Date - true", () => {
        expect(constraint.isValidConstraintValue(new Date())).toBeTruthy();
      });
    });

    describe("transform", () => {
      test("valid number string - number", () => {
        const val = constraint.transform("12");
        expect(isString(val)).toBeTruthy();
      });

      test("invalid date string - throws", () => {
        const date = constraint.transform(new Date());
        expect(isString(date)).toBeTruthy();
      });

      test("integer - Date", () => {
        expect(isString(constraint.transform(1))).toBeTruthy();
      });
    });
  });
});
