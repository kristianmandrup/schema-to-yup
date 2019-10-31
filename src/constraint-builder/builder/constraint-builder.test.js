import { ConstraintBuilder } from "../test/_helpers";

const { log } = console;

const createInst = () => new ConstraintBuilder();

describe("ConstraintBuilder", () => {
  describe("instance", () => {
    let instance;
    beforeEach(() => {
      instance = new ConstraintBuilder();
    });

    describe.only("createConstraint", () => {
      describe("valid opts", () => {
        const opts = {
          method: "oneOf", // method actually called
          constraintName: "enum", // what is used in config
          propName: "items",
          constraintValue: ["x"],
          type: "string"
        };

        it("creates a constraint", () => {
          const constraint = instance.createConstraint(opts);
          expect(constraint).toBeDefined();
        });
      });

      describe("invalid opts (empty)", () => {
        const opts = {};

        it("throws error", () => {
          expect(() => instance.createConstraint(opts)).toThrow();
        });
      });
    });

    describe.only("createConstraintOpts", () => {
      describe("valid opts", () => {
        const opts = {
          method: "oneOf", // method actually called
          constraintName: "enum", // what is used in config
          propName: "items",
          constraintValue: ["x"],
          type: "string"
        };

        const createOpts = () => instance.createConstraintOpts(opts);

        it("no throw", () => {
          expect(createOpts).not.toThrow();
        });

        it("creates constraint opts", () => {
          const $opts = createOpts();
          expect($opts).toBeDefined();
        });
      });

      describe("invalid opts (empty)", () => {
        const createOpts = () => instance.createConstraintOpts();
        it("throws error", () => {
          expect(createOpts).toThrow();
        });
      });
    });

    describe.only("getYupConstraintMethodName", () => {
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

    describe.only("constraintWithSingleValue", () => {
      const opts = {
        method: "min",
        type: "number"
      };

      describe("valid value and opts", () => {
        it("ok", () => {
          expect(() =>
            instance.constraintWithSingleValue(2, opts)
          ).not.toThrow();
        });
      });

      describe("invalid opts", () => {
        it("throws", () => {
          expect(() => instance.constraintWithSingleValue(2, {})).toThrow();
        });
      });

      describe("null value", () => {
        const createWNull = () =>
          instance.constraintWithSingleValue(null, opts);
        it("no throw", () => {
          expect(createWNull).not.toThrow();
        });

        it("is falsy", () => {
          expect(createWNull()).toBeFalsy();
        });
      });
    });

    describe.only("constraintWithValues", () => {
      const opts = {
        method: "enum",
        type: "string"
      };

      describe("valid value and opts", () => {
        it("ok", () => {
          expect(() =>
            instance.constraintWithValues(["x"], opts)
          ).not.toThrow();
        });
      });

      describe("null value", () => {
        const createWNull = () => instance.constraintWithValues(null, opts);
        it("no throw", () => {
          expect(createWNull).not.toThrow();
        });

        it("is falsy", () => {
          expect(createWNull()).toBeFalsy();
        });
      });
    });

    describe.only("constraintWithNoValue", () => {
      const opts = {
        method: "url",
        type: "string"
      };

      describe("valid opts", () => {
        it("ok", () => {
          expect(() => instance.constraintWithNoValue(opts)).not.toThrow();
        });
      });

      describe("invalid opts", () => {
        const createWNull = () => instance.constraintWithNoValue(opts);
        it("no throw", () => {
          expect(createWNull).not.toThrow();
        });

        it("is falsy", () => {
          expect(createWNull()).toBeFalsy();
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
