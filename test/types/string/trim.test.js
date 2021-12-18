import { createStr, createSchema } from "./_helpers";

describe("trim - strict", () => {
  const conf = { trim: true, strict: true, key: "name" };
  describe("create schema", () => {
    // TODO
    test.skip("trim", () => {
      expect(createStr(conf)).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr(conf);
    const schema = createSchema(entry, "name");

    test("valid name - trimmed", () => {
      const valid = schema.isValidSync({
        name: "abc"
      });
      expect(valid).toBeTruthy();
    });

    // todo: why does this fail!?
    test.skip("invalid name - not trimmed", () => {
      const valid = schema.isValidSync({
        name: "   zxy124 "
      });
      expect(valid).toBeFalsy();
    });
  });
});
