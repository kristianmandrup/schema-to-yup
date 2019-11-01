import { createNumEntry, createSchema } from "./_helpers";

const create = createNumEntry;

describe("default", () => {
  describe("number constraint only - not required", () => {
    const conf = { key: "level" };
    describe("validate", () => {
      const entry = create(conf);
      const schema = createSchema(entry, "level");

      test("valid level - required is present", () => {
        const valid = schema.isValidSync({
          level: "ACV"
        });
        expect(valid).toBeTruthy();
      });
    });
  });
});
