import { createStr, createSchema } from "./_helpers";

describe("false - name", () => {
  const conf = { notRequired: true, key: "name" };
  describe("create schema", () => {
    test("schema", () => {
      const schema = createStr(conf);
      const { tests } = schema;
      console.log("not required", { schema, tests });
      expect(schema).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr(conf);
    const schema = createSchema(entry, "name");

    test("valid name - not required is present", () => {
      const valid = schema.isValidSync({
        name: "ACV"
      });
      expect(valid).toBeTruthy();
    });

    test("invalid name - not required not present", () => {
      const valid = schema.isValidSync({});
      expect(valid).toBeTruthy();
    });
  });
});
