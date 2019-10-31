import { toAbstract } from "./_helpers";

describe("AbstractType", () => {
  describe("instance", () => {
    const opts = {
      schema: {},
      key: "name",
      value: {
        type: "string"
      }
    };
    const instance = toAbstract(opts);

    test("has config", () => {
      expect(instance.config).toBeTruthy();
    });
  });
});
