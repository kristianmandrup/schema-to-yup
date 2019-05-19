const { createDefinitionRefResolver } = require("./definition-ref");

describe("DefinitionRefResolver", () => {
  const reference = "#/definitions/car";
  const schema = {
    definitions: {
      car: {
        type: "object",
        name: "superCar",
        properties: {}
      }
    }
  };
  const config = {};

  const opts = { schema };

  const resolver = createDefinitionRefResolver(opts, config);
  resolver.reference = reference;

  describe("refObjectFor", () => {
    const obj = resolver.refObjectFor(reference);

    test("resolves to referenced object", () => {
      expect(obj).toEqual({});
    });
  });
});
