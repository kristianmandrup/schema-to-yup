const { createStringConstraint } = require("./_imports");

describe("createStringConstraint", () => {
  const map = "round";
  const opts = {
    map
  };
  const typer = {};
  const constraint = createStringConstraint(typer, opts);

  describe("instance", () => {
    test("map", () => {
      expect(constraint.map).toBe({ round });
    });
  });
});
