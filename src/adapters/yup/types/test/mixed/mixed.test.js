import { toYupMixed, createEntry } from "./_helpers";

describe("YupMixed", () => {
  describe("instance", () => {
    const opts = {
      schema: {},
      key: "name",
      value: {
        type: "string"
      }
    };
    const instance = toYupMixed(opts);

    test("has config", () => {
      expect(instance.config).toBeTruthy();
    });
  });

  describe("convert", () => {});

  describe("createWhenConditionFor", () => {});

  describe("isType", () => {});

  describe("oneOf", () => {});

  describe("notOneOf", () => {});

  describe("when", () => {});

  describe("nullable", () => {});
});

describe("createEntry", () => {
  test("null - throws", () => {
    expect(() => createEntry(null)).toThrow();
  });
});
