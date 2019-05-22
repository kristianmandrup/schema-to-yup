import { SchemaTypeResolver } from "../../lib/resolver";

describe("SchemaTypeResolver", () => {
  const opts = {};
  const config = {};
  const resolver = new SchemaTypeResolver();

  describe("schemaTypeWalkerMap", () => {
    describe("default", () => {
      test("is set", () => {
        expect(resolver.schemaTypeWalkerMap).toBeDefined();
      });
    });

    describe("passed", () => {
      const schemaTypeWalkerMap = {};
      const config = {
        schemaTypeWalkerMap
      };
      const resolver = new SchemaTypeResolver();

      test("is set to passed", () => {
        expect(resolver.schemaTypeWalkerMap).toBe(schemaTypeWalkerMap);
      });
    });
  });

  describe("entryType", () => {
    describe("array", () => {
      const entry = {
        type: "array"
      };
      test("is array", () => {
        expect(resolver.entryType(entry)).toEqual("array");
      });
    });

    describe("object", () => {
      const entry = {
        type: "object"
      };
      test("is object", () => {
        expect(resolver.entryType(entry)).toEqual("object");
      });
    });

    describe("string", () => {
      const entry = {
        type: "string"
      };
      test("is primitive", () => {
        expect(resolver.entryType(entry)).toEqual("primitive");
      });
    });
  });

  describe("schemaTypeWalkerFor", () => {
    describe("array", () => {
      const entry = {
        type: "array"
      };
      const walker = resolver.schemaTypeWalkerFor(entry);
      test("is array walker", () => {
        expect(walker.schemaType).toEqual("array");
      });
    });

    describe("object", () => {
      const entry = {
        type: "object"
      };
      const walker = resolver.schemaTypeWalkerFor(entry);
      test("is object walker", () => {
        expect(walker.schemaType).toEqual("object");
      });
    });

    describe("string", () => {
      const entry = {
        type: "string"
      };
      const walker = resolver.schemaTypeWalkerFor(entry);
      test("is primitive walker", () => {
        expect(walker.schemaType).toEqual("primitive");
      });
    });
  });

  describe("schemaTypeWalkerFactoryFor", () => {
    describe("string", () => {
      const entry = {
        type: "string"
      };
      const factory = resolver.schemaTypeWalkerFactoryFor(entry);
      test("is function", () => {
        expect(typeof factory).toEqual("function");
      });
    });
  });
});
