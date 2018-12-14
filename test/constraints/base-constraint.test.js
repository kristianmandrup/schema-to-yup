const { Constraint } = require("./_imports");

describe("Constraint", () => {
  const map = {
    max: ["maxDate", "max"],
    min: ["minDate", "min"]
  };
  const opts = {
    map
  };
  const typer = {
    constraints: {
      type: "string",
      format: "date"
    },
    applyConstraintToValidator: () => true
  };

  describe("instance", () => {
    const constraint = new Constraint(typer, opts);
    test("mapFor", () => {
      expect(constraint.mapFor(map)).toBe(map);
    });

    test("checkValue - identity", () => {
      expect(constraint.checkValue(1)).toBe(true);
    });

    test("toArgument - identity", () => {
      expect(constraint.toArgument(1)).toBe(1);
    });
  });
});
