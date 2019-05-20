import { ChildEntryWalker } from "./child-entry-walker";

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
});
