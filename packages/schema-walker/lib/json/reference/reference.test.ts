import { createReference } from "./reference";

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

const resolver = createReference(opts, config);
resolver.reference = reference;

describe("Reference", () => {
  describe("name", () => {
    const { name } = resolver;

    test("is superCar", () => {
      expect(name).toEqual("superCar");
    });
  });

  describe("typeName", () => {
    const { typeName } = resolver;

    test("is SuperCar", () => {
      expect(typeName).toEqual("SuperCar");
    });
  });

  describe("refName", () => {
    const { refName } = resolver;

    test("is car", () => {
      expect(refName).toEqual("car");
    });
  });

  describe("refObject", () => {
    const { refObject } = resolver;

    test("is an object with name: superCar", () => {
      expect(typeof refObject).toEqual("object");
      expect(refObject.name).toEqual("superCar");
    });
  });

  describe("normalizedRef", () => {
    const { normalizedRef } = resolver;

    test("is car", () => {
      expect(normalizedRef).toEqual("definitions/car");
    });
  });

  describe("dotPath", () => {
    const { dotPath } = resolver;

    test("is car", () => {
      expect(dotPath).toEqual("definitions.car");
    });
  });

  describe("referencePathResolvedAndVisited", () => {
    const obj = {
      type: "string"
    };
    resolver.referencePathResolvedAndVisited(obj);
    test("obj is cached", () => {
      const { referenceFromCache } = resolver;
      expect(referenceFromCache).toEqual(obj);
    });
  });

  describe("referenceFromCache", () => {
    describe("cache miss", () => {
      const { referenceFromCache } = resolver;
      test("no ref", () => {
        expect(referenceFromCache).toEqual("SuperCar");
      });
    });

    describe("cache hit", () => {
      resolver.reference = reference;
      resolver.visitedPaths[resolver.dotPath] = reference;

      const { referenceFromCache } = resolver;
      test("reference", () => {
        expect(referenceFromCache).toEqual(reference);
      });
    });
  });
});
