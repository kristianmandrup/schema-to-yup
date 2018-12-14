const { createStringConstraint } = require("./_imports");

describe("createStringConstraint", () => {
  const map = "round";
  const opts = {
    map
  };
  const typer = {
    constraints: {
      type: "string"
    }
  };
  const constraint = createStringConstraint(typer, opts);

  describe("instance", () => {
    test("map", () => {
      expect(constraint.map).toBe({ round });
    });

    describe("isValidConstraintValue", () => {
      test("string - true", () => {
        expect(constraint.isValidConstraintValue("12")).toBeTruthy();
      });

      test("number - false", () => {
        expect(constraint.isValidConstraintValue(14)).toBeFalsy();
      });

      test("RegExp - false", () => {
        expect(constraint.isValidConstraintValue(new RegExp("x"))).toBeFalsy();
      });

      test("Date - false", () => {
        expect(constraint.isValidConstraintValue(new Date())).toBeFalsy();
      });
    });
  });
});
