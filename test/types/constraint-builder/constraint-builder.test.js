import { ConstraintBuilder } from "./_helpers";

describe("ConstraintBuilder", () => {
  describe("instance", () => {
    const instance = new ConstraintBuilder();

    describe.only("createConstraint", () => {
      describe("valid opts", () => {
        const opts = {
          method: "oneOf", // method actually called
          constraintName: "enum", // what is used in config
          propName: "items",
          constraintValue: ["x"]
        };

        it("creates a constraint", () => {
          expect(instance.createConstraint(opts)).toEqual("x");
        });
      });

      describe("invalid opts (empty)", () => {
        const opts = {};

        it("throws error", () => {
          expect(() => instance.createConstraint(opts)).toThrow();
        });
      });
    });

    describe("createConstraintOpts", () => {
      const opts = {
        method: "oneOf", // method actually called
        constraintName: "enum", // what is used in config
        propName: "items",
        constraintValue: ["x"]
      };

      it("creates constraint opts", () => {
        expect(instance.createConstraintOpts(opts)).toEqual("x");
      });

      describe("invalid opts (empty)", () => {
        const opts = {};

        it("throws error", () => {
          expect(() => instance.createConstraintOpts(opts)).toThrow();
        });
      });
    });

    describe("getYupConstraintMethodName", () => {
      describe("valid method name", () => {
        const method = "oneOf";

        it("ok", () => {
          expect(() =>
            instance.getYupConstraintMethodName(method)
          ).not.toThrow();
        });
      });

      describe("invalid method name", () => {
        const method = "";

        it("throws error", () => {
          expect(() => instance.getYupConstraintMethodName(method)).toThrow();
        });
      });
    });

    describe("createConstraintOpts", () => {});

    describe("constraintWithSingleValue", () => {
      describe("valid value and opts", () => {
        const opts = {};

        it("ok", () => {
          expect(() =>
            instance.constraintWithSingleValue("x", opts)
          ).not.toThrow();
        });
      });

      describe("invalid value (none)", () => {
        const method = "";

        it("throws error", () => {
          expect(() => instance.constraintWithSingleValue(null)).toThrow();
        });
      });
    });

    describe("constraintWithValues", () => {
      describe("valid value and opts", () => {
        const opts = {};

        it("ok", () => {
          expect(() =>
            instance.constraintWithValues(["x"], opts)
          ).not.toThrow();
        });
      });

      describe("invalid value (none)", () => {
        it("throws error", () => {
          expect(() => instance.constraintWithValues(null)).toThrow();
        });
      });
    });

    describe("constraintWithNoValue", () => {
      describe("valid opts", () => {
        const opts = {};

        it("ok", () => {
          expect(() => instance.constraintWithNoValue(opts)).not.toThrow();
        });
      });

      describe("invalid opts", () => {
        it("throws error", () => {
          expect(() => instance.constraintWithNoValue(null)).toThrow();
        });
      });
    });

    describe("createNoValueConstraintBuilder", () => {
      describe("invalid opts", () => {
        it("throws error", () => {
          expect(() => instance.createNoValueConstraintBuilder(null)).toThrow();
        });
      });
    });

    describe("createListValueConstraintBuilder", () => {
      describe("invalid opts", () => {
        it("throws error", () => {
          expect(() =>
            instance.createListValueConstraintBuilder(null)
          ).toThrow();
        });
      });
    });

    describe("createSingleValueConstraintBuilder", () => {
      describe("invalid opts", () => {
        it("throws error", () => {
          expect(() =>
            instance.createSingleValueConstraintBuilder(null)
          ).toThrow();
        });
      });
    });

    describe("addValueConstraint", () => {
      describe("invalid propName (null)", () => {
        it("throws error", () => {
          expect(() => instance.addValueConstraint(null)).toThrow();
        });
      });
    });

    describe("addConstraint", () => {
      describe("invalid propName (null)", () => {
        it("throws error", () => {
          expect(() => instance.addConstraint(null)).toThrow();
        });
      });
    });

    describe("onConstraintAdded", () => {
      describe("invalid name (null)", () => {
        it("throws error", () => {
          expect(() => instance.onConstraintAdded(null)).toThrow();
        });
      });
    });

    describe("addMappedConstraints", () => {
      const constraintsMap = {
        empty: {},
        withValueKey: {
          value: 1
        },
        withKeys: {
          min: 1,
          max: 3
        }
      };
      describe("empty map", () => {
        it("does nothing and returns instance", () => {
          expect(instance.addMappedConstraints(constraintsMap.empty)).toBe(
            instance
          );
        });
      });

      describe("map with value key", () => {
        it("calls addValueConstraint", () => {
          jest.spyOn(instance, "addValueConstraint");
          const result = instance.addMappedConstraints(constraintsMap);
          expect(instance.addValueConstraint).toHaveBeenCalledTimes(1);
        });
      });

      describe("map with keys", () => {
        it("calls addValueConstraint", () => {
          jest.spyOn(instance, "addConstraint");
          const result = instance.addMappedConstraints(constraintsMap);
          expect(instance.addConstraint).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe("constraintsMap", () => {
      const { constraintsMap } = instance;
      describe("map keys", () => {
        it("has: simple, value", () => {
          expect(Object.keys(constraintsMap)).toEqual(["simple", "value"]);
        });
      });

      describe("simple", () => {
        it("has: required, notRequired, nullable", () => {
          expect(constraintsMap.simple).toEqual([
            "required",
            "notRequired",
            "nullable"
          ]);
        });
      });

      describe("value", () => {
        it("has: default, strict", () => {
          expect(constraintsMap.simple).toEqual(["default", "strict"]);
        });
      });
    });

    describe("constraintValueFor", () => {
      it("gets constraint value", () => {
        const opts = {
          constraintValue: "oneOf",
          propValue: ["x"],
          propName: "items"
        };
        expect(instance.constraintValueFor(opts)).not.toThrow();
      });
    });

    describe("build", () => {
      describe("no args", () => {
        it("throws: missing prop name", () => {
          expect(() => instance.build()).toThrow();
        });
      });

      describe("prop name: age", () => {
        it("returns yup type instance", () => {
          expect(instance.build("age")).toBeDefined();
        });
      });
    });
  });
});
