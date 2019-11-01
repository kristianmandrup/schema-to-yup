import { createNumEntry, createSchema } from "./_helpers";

const create = createNumEntry;

describe("required", () => {
  describe("true - level", () => {
    const conf = { required: true, key: "level" };
    describe("create schema", () => {
      test("schema", () => {
        const schema = create(conf);
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
      const entry = create(conf);
      const schema = createSchema(entry, "level");

      test("valid level - required is present", () => {
        const valid = schema.isValidSync({
          level: "ACV"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid level - required not present", () => {
        const valid = schema.isValidSync({});
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("false - level", () => {
    const conf = { required: false, key: "level" };
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
      const schema = createSchema(entry, "level");

      test("valid level - not required is present", () => {
        const valid = schema.isValidSync({
          level: "ACV"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid level - not required not present", () => {
        const valid = schema.isValidSync({});
        expect(valid).toBeTruthy();
      });
    });
  });
});
