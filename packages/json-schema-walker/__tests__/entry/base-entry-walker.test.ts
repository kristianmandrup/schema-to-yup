import { BaseSchemaEntryWalker } from "../../../json-schema-walker/lib/entry/base-entry-walker";

const create = (opts = {}, config = {}) =>
  new BaseSchemaEntryWalker(opts, config);

describe("BaseSchemaEntryWalker", () => {
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
});
