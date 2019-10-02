import { ConstraintBuilder } from "./_helpers";

describe("ConstraintBuilder", () => {
  describe("instance", () => {
    const instance = new ConstraintBuilder();

    describe("createConstraint", () => {
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

    describe("addMappedConstraints", () => {});

    describe("constraintsMap", () => {});

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
      it("builds", () => {
        expect(instance.build()).not.toThrow();
      });
    });
  });
});
