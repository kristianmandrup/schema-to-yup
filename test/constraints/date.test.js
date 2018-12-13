const { createDateConstraint } = require("./_imports");

describe("createDateConstraint", () => {
  const map = {
    max: ["maxDate", "max"],
    min: ["minDate", "min"]
  };
  const opts = {
    map
  };
  const typer = {};

  describe("instance", () => {
    const constraint = createDateConstraint(typer, opts);
    test("map", () => {
      expect(constraint.map).toBe(map);
    });
  });
});
