const { createReference } = require("./reference");

const refs = {
  car: "#/definitions/car",
  driver: "#/definitions/driver"
};

describe("Multi Reference", () => {
  const multiRefSchema = {
    type: "object",
    properties: {
      cars: {
        type: "array",
        items: {
          $ref: "#/definitions/car"
        }
      }
    },
    definitions: {
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
            cars: {
              type: "array",
              items: {
                $ref: "#/definitions/car"
              }
            }
          }
        }
      }
    }
  };

  describe("circular resolved via cache", () => {
    const obj = ref.resolveRefObject();
    const config = {};
    const opts = { schema: multiRefSchema, reference };
    const ref = createReference(opts, config);

    const reference = refs.car;
    test("is ", () => {
      expect(obj).toEqual(expected);
    });
  });
});
