const { createReference } = require("./reference");

const refs = {
  car: "#/definitions/car",
  driver: "#/definitions/driver"
};

const resolved = {
  car: {
    type: "object",
    name: "superCar",
    properties: {
      ownedBy: {
        $ref: "#/definitions/driver"
      }
    }
  },
  driver: {
    type: "object",
    name: "superCar",
    properties: {
      owns: {
        car: {
          $ref: "#/definitions/car"
        }
      }
    }
  }
};

describe("Reference", () => {
  const schema = {
    type: "object",
    properties: {
      car: {
        $ref: "#/definitions/car"
      }
    },
    definitions: {
      car: resolved.car,
      driver: resolved.driver
    }
  };
  const config = {
    logging: true
  };

  const run = (name, config) => {
    const reference = refs[name];
    const opts = { schema, reference };
    const ref = createReference(opts, config);

    const obj = ref.resolvedRefObject;
    const expected = resolved[name];
    return [obj, expected, ref];
  };

  describe("car ref", () => {
    const [obj, expected, ref] = run("car", config);

    test("resolved to car object def", () => {
      expect(obj).toEqual(expected);
    });

    test("car ref has 0 hits", () => {
      expect(ref.hits[refs.car]).toBeUndefined();
    });
  });
  describe("driver ref", () => {
    const [obj, expected, ref] = run("driver");
    test("resolved to driver", () => {
      expect(obj).toEqual(expected);
    });

    test("driver ref has 0 hits", () => {
      expect(ref.hits[refs.driver]).toBeUndefined();
    });
  });

  describe("driver, car, then driver ref again", () => {
    const [driverObj, driver, r1] = run("driver");
    const [carObj, car, r2] = run("car", r1.$config);

    const [driverAgainObj, driverAgain, r3] = run("driver", r2.$config);
    test("resolved to driver", () => {
      expect(driverObj).toBe(driverAgainObj);
    });

    test("first driver ref was not cache hit", () => {
      expect(r1.wasCacheHit).toBeFalsy();
    });

    test("car ref was not cache hit", () => {
      expect(r2.wasCacheHit).toBeFalsy();
    });

    test("car ref has 0 hits", () => {
      expect(r3.hits[refs.car]).toBeUndefined();
    });

    test("driver ref has 1 hits", () => {
      expect(r3.hits[refs.driver]).toBe(1);
    });

    test("driver ref was cache hit", () => {
      expect(r3.wasCacheHit).toBeTruthy();
    });
  });
});
