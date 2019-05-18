import { Constraint } from "./_imports";

describe("Constraint", () => {
  const value = {
    max: ["maxDate"],
    min: ["minDate"]
  };
  const opts = {
    value
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
      expect(constraint.mapFor(value)).toBe(value);
    });

    test("namesFor", () => {
      const names = constraint.namesFor("max");
      expect(names).toEqual(["max", "maxDate"]);
    });

    test("checkValue - identity", () => {
      expect(constraint.checkValue(1)).toBe(true);
    });

    // test("toArgument - identity", () => {
    //   expect(constraint.toArgument(1)).toBe(1);
    // });
  });
});
