import { createStr, createSchema } from "./_helpers";

describe("url", () => {
  describe("create schema", () => {
    test("url", () => {
      expect(createStr({ url: true, key: "url" })).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr({ url: true, key: "url" });
    const schema = createSchema(entry, "url");

    test("valid url", () => {
      const valid = schema.isValidSync({
        url: "http://dog.com"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid url", () => {
      const valid = schema.isValidSync({
        url: "zxy@x"
      });
      expect(valid).toBeFalsy();
    });
  });
});
