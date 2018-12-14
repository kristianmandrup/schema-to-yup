const { createRegExpConstraint } = require("./_imports");

describe("createRegExpConstraint", () => {
  const pattern = "pattern";
  const opts = {
    value: pattern
  };
  const typer = {
    constraints: {
      type: "string"
    },
    applyConstraintToValidator: (name, value, method) => true,
    toRegExp: val => new RegExp(val)
  };
  const constraint = createRegExpConstraint(typer, opts);

  describe("instance", () => {
    test("map", () => {
      expect(constraint.map).toEqual({ pattern });
    });

    describe("isRegExpLike", () => {
      test("string - true", () => {
        expect(constraint.isRegExpLike("12")).toBeTruthy();
      });

      test("number - true", () => {
        expect(constraint.isRegExpLike(14)).toBeTruthy();
      });

      test("RegExp - true", () => {
        expect(constraint.isRegExpLike(new RegExp("x"))).toBeTruthy();
      });
    });

    describe("isValidConstraintValue", () => {
      test("string - true", () => {
        expect(constraint.isValidConstraintValue("12")).toBeTruthy();
      });

      test("number - true", () => {
        expect(constraint.isValidConstraintValue(14)).toBeTruthy();
      });

      test("RegExp - true", () => {
        expect(constraint.isValidConstraintValue(new RegExp("x"))).toBeTruthy();
      });
    });

    describe("transform", () => {
      test("string - RegExp", () => {
        expect(constraint.transform("12") instanceof RegExp).toBeTruthy();
      });

      test("number - RegExp", () => {
        expect(constraint.transform(14) instanceof RegExp).toBeTruthy();
      });

      test("RegExp - RegExp", () => {
        expect(
          constraint.transform(new RegExp("x")) instanceof RegExp
        ).toBeTruthy();
      });
    });
  });
});
