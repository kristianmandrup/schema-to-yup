const { createNumericConstraint } = require("./_imports");

describe("createNumericConstraint", () => {
  const map = {
    max: ["maximum", "max"],
    min: ["minimum", "min"]
  };
  const opts = {
    map
  };
  const typer = {};

  describe("instance", () => {
    const constraint = createRegExpConstraint(typer, opts);
    test("map", () => {
      expect(constraint.map).toBe(map);
    });

    describe("isValidConstraintValue", () => {
      test("valid number string - number", () => {
        expect(constraint.isValidConstraintValue("12")).toBeTruthy();
      });

      test("invalid date string - throws", () => {
        expect(constraint.isValidConstraintValue("xa")).toBeFalsy();
      });

      test("integer - Date", () => {
        expect(constraint.isValidConstraintValue(1)).toBeTruthy();
      });
    });

    describe("transform", () => {
      test("valid number string - number", () => {
        expect(constraint.transform("12") instanceof Number).toBeTruthy();
      });

      test("invalid date string - throws", () => {
        expect(constraint.transform("xa") instanceof Number).toBeFalsy();
      });

      test("integer - Date", () => {
        expect(constraint.transform(1) instanceof Number).toBeTruthy();
      });
    });
  });
});
