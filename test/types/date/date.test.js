const { types } = require("../../../src");
const { toYupDate } = types;
const yup = require("yup");

const isDate = fieldDef => fieldDef && fieldDef.type === "date";
const config = { isDate };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupDate(obj, config);
};

const oneDay = 86400000;

const createDate = value => {
  const obj = { value, config, key: "createdAt", type: "date" };
  return toYupDate(obj, config);
};

const createDateNoKey = value => {
  const obj = { value, config, type: "date" };
  return toYupDate(obj, config);
};

const createSchema = createdAt => {
  return yup.object().shape({
    createdAt
  });
};

describe("toYupDate", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createDate({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createDateNoKey({})).toThrow();
  });

  describe("is date type", () => {
    describe("schema opts", () => {
      test("bad string - ignored?", () => {
        expect(() => createDate({})).not.toThrow();
      });
    });

    describe("validate", () => {
      const opts = createDate({});
      const schema = createSchema(opts);
      // console.log({opts, schema: schema.fields.createdAt })

      test("is date type", () => {
        const valid = schema.isValidSync({
          createdAt: new Date(Date.now() - oneDay)
        });
        expect(valid).toBeTruthy();
      });

      test("is not date type", () => {
        const valid = schema.isValidSync({
          createdAt: "abc123"
        });
        expect(valid).toBeFalsy();
      });
    });
  })

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
      const opts = createDate({ maxDate: new Date() });
      const schema = createSchema(opts);

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
      const opts = createDate({ minDate: new Date() });
      const schema = createSchema(opts);

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
