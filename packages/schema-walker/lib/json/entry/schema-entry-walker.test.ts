import { SchemaEntryWalker } from "./schema-entry-walker";

const create = (opts = {}, config = {}) => new SchemaEntryWalker(opts, config);

describe("SchemaEntryWalker", () => {
  const config = {};
  const opts = {};
  const instance: any = create(opts, config);

  describe("create", () => {
    describe("config", () => {
      test("is passed config", () => {
        expect(instance.config).toBe(config);
      });
    });
  });

  describe("walkEntry", () => {
    describe("string", () => {
      const entry = {
        type: "string"
      };
      const walker = instance
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
