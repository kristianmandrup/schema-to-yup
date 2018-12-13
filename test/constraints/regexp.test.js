const { createRegExpConstraint } = require("./_imports");

describe("createRegExpConstraint", () => {
  const map = "pattern";
  const opts = {
    map
  };
  const typer = {};
  const constraint = createRegExpConstraint(typer, opts);

  describe("instance", () => {
    test("map", () => {
      expect(constraint.map).toBe({ pattern });
    });
  });
});
