import { date } from "./_imports";
const { toSchemaEntry } = date;

const isDate = fieldDef => fieldDef && fieldDef.type === "date";
const config = { isDate };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toSchemaEntry(obj, config);
};

const oneDay = 86400000;

const createDate = value => {
  const obj = { value, config, key: "createdAt", type: "date" };
  return toSchemaEntry(obj, config);
};

const createDateNoKey = value => {
  const obj = { value, config, type: "date" };
  return toSchemaEntry(obj, config);
};

const createSchema = createdAt => {
  return yup.object().shape({
    createdAt
  });
};

describe("toSchemaEntry", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createDate({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createDateNoKey({})).toThrow();
  });

  describe("maxDate", () => {
    describe("schema opts", () => {
      test("bad string - ignored?", () => {
        expect(() => createDate({ maxDate: "2" })).not.toThrow();
      });

      test("negative number - ok", () => {
        expect(() => createDate({ maxDate: -1 })).not.toThrow();
      });
    });

    describe("validate", () => {
      const arr = createDate({ maxDate: new Date() });
      const schema = createSchema(arr);

      test("less date", () => {
        const valid = schema.isValidSync({
          createdAt: new Date(Date.now() - oneDay)
        });
        expect(valid).toBeTruthy();
      });

      test("equal date - not valid?", () => {
        expect(schema.isValidSync({ createdAt: new Date() })).toBeFalsy();
      });

      test("more date", () => {
        const valid = schema.isValidSync({
          createdAt: new Date(Date.now() + oneDay)
        });
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("minDate", () => {
    describe("schema opts", () => {
      test("bad string - ignored?", () => {
        expect(() => createDate({ minDate: "2" })).not.toThrow();
      });

      test("negative number - ok", () => {
        expect(() => createDate({ minDate: -1 })).not.toThrow();
      });
    });

    describe("validate", () => {
      const arr = createDate({ minDate: new Date() });
      const schema = createSchema(arr);

      test("less date", () => {
        const valid = schema.isValidSync({
          createdAt: new Date(Date.now() - oneDay)
        });
        expect(valid).toBeFalsy();
      });

      test("equal date - valid?", () => {
        expect(schema.isValidSync({ createdAt: new Date() })).toBeTruthy();
      });

      test("more date", () => {
        const valid = schema.isValidSync({
          createdAt: new Date(Date.now() + oneDay)
        });
        expect(valid).toBeTruthy();
      });
    });
  });
});
