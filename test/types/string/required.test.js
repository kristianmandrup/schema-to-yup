import { createStr, createSchema } from "./_helpers";

describe("required", () => {
  describe("true - name", () => {
    const conf = { required: true, key: "name" };
    describe("create schema", () => {
      test("schema", () => {
        const schema = createStr(conf);
        const { tests } = schema;
        console.log("required", {
          schema,
          tests,
          ...tests
        });
        expect(schema).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr(conf);
      const schema = createSchema(entry, "name");

      test("valid name - required is present", () => {
        const valid = schema.isValidSync({
          name: "ACV"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid name - required not present", () => {
        const valid = schema.isValidSync({});
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("false - name", () => {
    const conf = { required: false, key: "name" };
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
});
