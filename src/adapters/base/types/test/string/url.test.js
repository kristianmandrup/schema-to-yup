import { createStr, createSchema } from "./_helpers";

const entryValidation = entry => {
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
};

describe("url", () => {
  describe("create schema", () => {
    test("url", () => {
      expect(createStr({ url: true, key: "url" })).toBeTruthy();
    });
  });

  describe("url", () => {
    describe("create schema", () => {
      test("url", () => {
        expect(createStr({ url: true, key: "url" })).toBeTruthy();
      });

      test("format url", () => {
        expect(createStr({ format: "url", key: "url" })).toBeTruthy();
      });
    });

    describe("format: url", () => {
      const entry = createStr({ format: "url", key: "url" });

      entryValidation(entry);
    });

    describe("url: true", () => {
      const entry = createStr({ url: true, key: "url" });

      entryValidation(entry);
    });
  });
});
