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
  });
});
