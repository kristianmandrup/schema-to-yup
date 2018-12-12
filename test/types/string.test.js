const yup = require("yup");
const { types } = require("../../src");
const { toYupString } = types;

const isString = fieldDef => fieldDef && fieldDef.type === "string";
const config = { isString };
const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupString(obj, config);
};

const createStr = (value, key = "x") => {
  const obj = { value, config, key, type: "string" };
  return toYupString(obj, config);
};

const createStrNoKey = value => {
  const obj = { value, config, type: "string" };
  return toYupString(obj, config);
};

const createSchema = (schemaEntry, label = "value") => {
  return yup.object().shape({
    [label]: schemaEntry
  });
};

describe("toYupString", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("number - %", () => {
    expect(create(1)).toBeFalsy();
  });

  test("entryay - %", () => {
    expect(create([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(create({ x: 2 })).toBeFalsy();
  });

  test("int object - %", () => {
    expect(create({ type: "int" })).toBeFalsy();
  });

  test("string object - ok", () => {
    expect(createStr({})).toBeTruthy();
  });

  test("string - throws missing key", () => {
    expect(() => createStrNoKey("x")).toThrow();
  });

  test("null - throws missing value", () => {
    expect(() => createStr(null)).toThrow();
  });

  describe("lowercase - strict", () => {
    const conf = { lowercase: true, strict: true, key: "name" };
    describe("create schema", () => {
      test("lowercase", () => {
        expect(createStr(conf)).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr(conf);
      const schema = createSchema(entry, "name");

      test("valid name", () => {
        const valid = schema.isValidSync({
          name: "abc"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid name", () => {
        const valid = schema.isValidSync({
          name: "AXDadf"
        });
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("uppercase - strict", () => {
    const conf = { uppercase: true, strict: true, key: "name" };
    describe("create schema", () => {
      test("uppercase", () => {
        expect(createStr(conf)).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr(conf);
      const schema = createSchema(entry, "name");

      test("valid name", () => {
        const valid = schema.isValidSync({
          name: "ACV"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid name", () => {
        const valid = schema.isValidSync({
          name: "AXDadf"
        });
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("trim - strict", () => {
    const conf = { trim: true, strict: true, key: "name" };
    describe("create schema", () => {
      test("trim", () => {
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

  describe("minLength", () => {
    const conf = { minLength: 4, key: "name" };
    describe("create schema", () => {
      test("minLength", () => {
        expect(createStr(conf)).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr(conf);
      const schema = createSchema(entry, "name");

      test("valid name", () => {
        const valid = schema.isValidSync({
          name: "abcde"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid name", () => {
        const valid = schema.isValidSync({
          name: "zxy"
        });
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("maxLength", () => {
    const conf = { maxLength: 4, key: "name" };
    describe("create schema", () => {
      test("maxLength", () => {
        expect(createStr(conf)).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr(conf);
      const schema = createSchema(entry, "name");

      test("valid name", () => {
        const valid = schema.isValidSync({
          name: "abc"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid name", () => {
        const valid = schema.isValidSync({
          name: "zxy124"
        });
        expect(valid).toBeFalsy();
      });
    });
  });
  describe("pattern", () => {
    describe("create schema", () => {
      test("pattern", () => {
        expect(createStr({ pattern: /\w+/, key: "name" })).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr({ pattern: "abc", key: "name" });
      const schema = createSchema(entry, "name");

      test("valid pattern", () => {
        const valid = schema.isValidSync({
          name: "abc"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid pattern", () => {
        const valid = schema.isValidSync({
          name: "@123"
        });
        expect(valid).toBeFalsy();
      });
    });
  });

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

  describe("email", () => {
    describe("create schema", () => {
      test("email", () => {
        expect(createStr({ email: true, key: "email" })).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr({ email: true, key: "email" });
      const schema = createSchema(entry, "email");

      test("valid email", () => {
        const valid = schema.isValidSync({
          email: "a@b.com"
        });
        expect(valid).toBeTruthy();
      });

      test("invalid email", () => {
        const valid = schema.isValidSync({
          email: "zxy@"
        });
        expect(valid).toBeFalsy();
      });
    });
  });

  // TODO: requires using validator-bridge
  describe.skip("genericFormat", () => {
    describe("schema opts", () => {
      test("hexColor", () => {
        expect(createStr({ hexColor: true })).toBeTruthy();
      });
    });

    describe("validate", () => {
      const entry = createStr({ hexColor: true });
      const schema = createSchema(entry, "color");

      test("valid hexColor", () => {
        const valid = schema.isValidSync({
          color: "#ff0000"
        });
        expect(valid).toBeFalsy();
      });

      test("invalid hexColor", () => {
        const valid = schema.isValidSync({
          color: "zxy"
        });
        expect(valid).toBeFalsy();
      });
    });
  });
});
