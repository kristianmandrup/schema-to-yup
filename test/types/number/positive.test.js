const { createNumEntry, createSchema } = require("./_helpers");

describe("positive - validate", () => {
  const entry = createNumEntry({ positive: true });
  const schema = createSchema(entry);

  test("negative: -1", () => {
    const valid = schema.isValidSync({
      value: -1
    });
    expect(valid).toBeFalsy();
  });

  test("zero: 0", () => {
    expect(schema.isValidSync({ value: 0 })).toBeFalsy();
  });

  test("positive: 2", () => {
    expect(schema.isValidSync({ value: 2 })).toBeTruthy();
  });
});
