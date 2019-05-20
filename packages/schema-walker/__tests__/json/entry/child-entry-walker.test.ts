import { ChildEntryWalker } from "../../../lib/json/entry/child-entry-walker";

const create = (opts = {}, config = {}) => new ChildEntryWalker(opts, config);

describe("ChildEntryWalker", () => {
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

  describe("isValidChildEntryType", () => {
    test("is true", () => {
      expect(instance.isValidChildEntryType).toBeTruthy();
    });
  });

  describe("invalidChildEntryType", () => {
    const entry = {
      type: "string"
    };
    test("throws", () => {
      expect(() => instance.invalidChildEntryType(entry)).toThrow();
    });
  });

  describe("validateChildEntryType", () => {
    describe("invalid", () => {
      const entry = {
        type: "blip"
      };
      test("throws", () => {
        expect(() => instance.validateChildEntryType(entry)).toThrow();
      });
    });

    describe("valid", () => {
      const entry = {
        type: "string"
      };
      test("throws", () => {
        expect(() => instance.validateChildEntryType(entry)).not.toThrow();
      });
    });
  });

  describe("walkChildEntry", () => {
    const entry = {
      type: "string"
    };
    const result = instance.walkChildEntry(entry);
    test("result", () => {
      expect(result).toBeDefined();
    });
  });
});
