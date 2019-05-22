import { ChildSchemaEntryWalker } from "../../lib/entry/child-entry-walker";

const create = (opts, config) => new ChildSchemaEntryWalker(opts, config);

describe("ChildSchemaEntryWalker", () => {
  const opts = {};
  const config = {};
  describe("create", () => {
    test("creates instance", () => {
      expect(create(opts, config)).toBeDefined();
    });
  });

  describe("instance", () => {
    const opts = {};
    const onEnter = (entry: any) => console.log("ENTER", entry);
    const onExit = (entry: any) => console.log("EXIT", entry);

    const config = {
      onEnter,
      onExit
    };
    const walker = create(opts, config);
    const childEntry = {
      key: "name",
      type: "string"
    };

    describe("walkChildEntry", () => {
      const result = walker.walkChildEntry(childEntry);
      test("result", () => {
        expect(result).toBeDefined();
      });
    });

    describe("validateChildEntryType", () => {
      describe("valid primitive string type", () => {
        const result = walker.validateChildEntryType(childEntry);
        test("result", () => {
          expect(result).toBeTruthy();
        });
      });
    });

    describe("invalidChildEntryType", () => {
      test("result", () => {
        expect(() => walker.invalidChildEntryType(childEntry)).toThrow();
      });
    });

    describe("isValidChildEntryType", () => {
      describe("valid primitive string type", () => {
        const result = walker.isValidChildEntryType(childEntry.type);
        test("is valid", () => {
          expect(result).toBeTruthy();
        });
      });
    });
  });
});
