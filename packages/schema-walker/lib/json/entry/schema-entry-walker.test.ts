import { SchemaEntryWalker } from "./schema-entry-walker";

const create = (opts = {}, config = {}) => new SchemaEntryWalker(opts, config);

describe("SchemaEntryWalker", () => {
  const config = {};
  const opts = {};
  const instance = create(opts, config);

  describe("create", () => {
    describe("config", () => {
      test("is passed config", () => {
        expect(instance.config).toBe(config);
      });
    });
  });

  describe("isValidChildEntryType", () => {
    test("is true", () => {
      expect(instance.isValidChildEntryType).toBeTruthy();
    });
  });

  describe("entryType", () => {
    describe("array", () => {
      const entry = {
        type: "array"
      };
      test("is array", () => {
        expect(instance.entryType(entry)).toEqual("array");
      });
    });

    describe("object", () => {
      const entry = {
        type: "object"
      };
      test("is object", () => {
        expect(instance.entryType(entry)).toEqual("object");
      });
    });

    describe("string", () => {
      const entry = {
        type: "string"
      };
      test("is primitive", () => {
        expect(instance.entryType(entry)).toEqual("primitive");
      });
    });
  });

  describe("schemaTypeWalkerFor", () => {
    describe("array", () => {
      const entry = {
        type: "array"
      };
      const walker = instance.schemaTypeWalkerFor(entry);
      test("is array walker", () => {
        expect(walker.schemaType).toEqual("array");
      });
    });

    describe("object", () => {
      const entry = {
        type: "object"
      };
      const walker = instance.schemaTypeWalkerFor(entry);
      test("is object walker", () => {
        expect(walker.schemaType).toEqual("object");
      });
    });

    describe("string", () => {
      const entry = {
        type: "string"
      };
      const walker = instance.schemaTypeWalkerFor(entry);
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
      const factory = instance.schemaTypeWalkerFactoryFor(entry);
      test("is function", () => {
        expect(typeof factory).toEqual("function");
      });
    });
  });

  describe("walkEntry", () => {
    describe("string", () => {
      const entry = {
        type: "string"
      };
      const walker = instance.schemaTypeWalkerFor(entry);
      test("empty obj result", () => {
        const result = walker.walkEntry(entry);
        expect(result).toEqual({});
      });

      describe("onEnter", () => {});

      describe("onExit", () => {});
    });
  });

  describe("walkChildEntry", () => {
    describe("string", () => {
      const entry = {
        type: "string"
      };

      describe("walks entry", () => {
        instance.walkChildEntry(entry);
      });
    });
  });

  describe("walkChildEntries", () => {
    describe("no child entries", () => {});

    describe("one child entry", () => {});

    describe("multiple child entries", () => {});
  });
});
