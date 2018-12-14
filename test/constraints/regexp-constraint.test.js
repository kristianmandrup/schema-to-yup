const { createRegExpConstraint } = require("./_imports");

describe("createRegExpConstraint", () => {
  const map = "pattern";
  const opts = {
    map
  };
  const typer = {
    constraints: {
      type: "string"
    }
  };
  const constraint = createRegExpConstraint(typer, opts);

  describe("instance", () => {
    test("map", () => {
      expect(constraint.map).toBe({ pattern });
    });

    describe("isRegExpLike", () => {
      test("string - true", () => {
        expect(constraint.isRegExpLike("12")).toBeTruthy();
      });

      test("number - false", () => {
        expect(constraint.isRegExpLike(14)).toBeFalsy();
      });

      test("RegExp - true", () => {
        expect(constraint.isRegExpLike(new RegExp("x"))).toBeTruthy();
      });
    });

    describe("isValidConstraintValue", () => {
      test("string - true", () => {
        expect(constraint.isValidConstraintValue("12")).toBeTruthy();
      });

      test("number - throws", () => {
        expect(constraint.isValidConstraintValue(14)).toBeFalsy();
      });

      test("RegExp - true", () => {
        expect(constraint.isValidConstraintValue(new RegExp("x"))).toBeTruthy();
      });
    });

    describe("transform", () => {
      test("string - true", () => {
        expect(constraint.transform("12") instanceof RegExp).toBeTruthy();
      });

      test("number - throws", () => {
        expect(() => constraint.transform(14)).toThrow();
      });

      test("RegExp - true", () => {
        expect(
          constraint.transform(new RegExp("x")) instanceof RegExp
        ).toBeTruthy();
      });
    });
  });
});
