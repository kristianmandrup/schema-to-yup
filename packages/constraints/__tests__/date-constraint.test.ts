import { createDateConstraint } from "./_imports";

describe("createDateConstraint", () => {
  const value = {
    max: ["maxDate", "max"],
    min: ["minDate", "min"]
  };
  const opts = {
    value
  };
  const typer = {
    constraints: {
      type: "string",
      format: "date"
    },
    applyConstraintToValidator: (name, value, method) => true,
    toDate: val => new Date(val)
  };

  describe("instance", () => {
    const constraint: any = createDateConstraint(typer, opts);
    test("map", () => {
      expect(constraint.map).toBe(value);
    });

    describe("isValidDateType", () => {
      test("valid date string - true", () => {
        expect(constraint.isValidDateType("1-1-2012")).toBeTruthy();
      });

      test("invalid date string - true", () => {
        expect(constraint.isValidDateType("1-2012")).toBeTruthy();
      });

      test("integer - true", () => {
        expect(constraint.isValidDateType(1)).toBeTruthy();
      });
    });

    describe("isValidDate", () => {
      test("valid date string - true", () => {
        expect(constraint.isValidDate("1-1-2012")).toBeTruthy();
      });

      test("invalid date string - false", () => {
        expect(constraint.isValidDate("1-2012")).toBeFalsy();
      });

      test("integer - true", () => {
        expect(constraint.isValidDate(1)).toBeTruthy();
      });
    });

    describe("isDateParseable", () => {
      test("valid date string - true", () => {
        expect(constraint.isDateParseable("1-1-2012")).toBeTruthy();
      });

      test("invalid date string - false", () => {
        expect(constraint.isDateParseable("1-2012")).toBeFalsy();
      });

      test("integer - false (also warns)", () => {
        expect(constraint.isDateParseable(1)).toBeFalsy();
      });
    });

    describe("isDateType", () => {
      test("valid date string - false", () => {
        expect(constraint.isDateType("1-1-2012")).toBeFalsy();
      });

      test("integer - false", () => {
        expect(constraint.isDateType(1)).toBeFalsy();
      });

      test("Date instance - true", () => {
        expect(constraint.isDateType(new Date())).toBeTruthy();
      });
    });

    describe("isDateLike", () => {
      test("valid date string - true", () => {
        expect(constraint.isDateLike("1-1-2012")).toBeTruthy();
      });

      test("invalid date string - false", () => {
        expect(constraint.isDateLike("1-2012")).toBeFalsy();
      });

      test("integer - true", () => {
        expect(constraint.isDateLike(1)).toBeTruthy();
      });
    });

    describe("isValidConstraintValue", () => {
      test("valid date string - true", () => {
        expect(constraint.isValidConstraintValue("1-1-2012")).toBeTruthy();
      });

      test("invalid date string - false", () => {
        expect(constraint.isValidConstraintValue("1-2012")).toBeFalsy();
      });

      test("integer - true", () => {
        expect(constraint.isValidConstraintValue(1)).toBeTruthy();
      });
    });

    describe("transformToDate", () => {
      test("valid date string - Date", () => {
        const validDate = constraint.transformToDate("1-1-2012");
        expect(validDate instanceof Date).toBeTruthy();
      });

      test("invalid date string - throws", () => {
        expect(() => constraint.transformToDate("1-2012")).toThrow();
      });

      test("integer - Date", () => {
        expect(constraint.transformToDate(1) instanceof Date).toBeTruthy();
      });
    });

    describe("transform", () => {
      test("valid date string - Date", () => {
        expect(constraint.transform("1-1-2012") instanceof Date).toBeTruthy();
      });

      test("invalid date string - throws", () => {
        expect(() => constraint.transform("1-2012")).toThrow();
      });

      test("integer - Date", () => {
        expect(constraint.transform(1) instanceof Date).toBeTruthy();
      });
    });
  });
});
