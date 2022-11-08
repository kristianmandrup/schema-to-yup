const { types } = require("../../../src");
const { toYupArray } = types;
const { createYupSchemaEntry } = require("../../../src/create-entry");
import schemaParserMaps from "../../../src/types/schema-parser-maps";

const yup = require("yup");
const defaultConfig = { ...schemaParserMaps, createYupSchemaEntry };

const create = (fieldDef, config = {}) => {
  config = Object.assign(defaultConfig, config);
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupArray(obj, config);
};

const createArr = (value, config = defaultConfig) => {
  const obj = { value, config, key: "list", type: "array" };
  return toYupArray(obj, config);
};

const createArrNoKey = (value, config = defaultConfig) => {
  const obj = { value, config, type: "array" };
  return toYupArray(obj, config);
};

const createSchema = (list) => {
  return yup.object().shape({
    list,
  });
};

describe("toYupArray", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });
  test("string - %", () => {
    expect(create("x")).toBeFalsy();
  });

  test("number - %", () => {
    expect(create(1)).toBeFalsy();
  });

  test("array - %", () => {
    expect(create([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(create({ x: 2 })).toBeFalsy();
  });

  test("string object - %", () => {
    expect(create({ type: "string" })).toBeFalsy();
  });

  test("array object - ok", () => {
    expect(() => createArr({})).toBeTruthy();
  });

  test("array object - ok", () => {
    expect(() => createArrNoKey({})).toThrow();
  });

  describe("maxItems", () => {
    describe("schema opts", () => {
      test("string - ignored", () => {
        expect(() => createArr({ maxItems: "2" })).not.toThrow();
      });

      test("negative - throws", () => {
        expect(() => createArr({ maxItems: -1 })).toThrow();
      });
    });

    describe("validate", () => {
      const arr = createArr({ maxItems: 3 });
      const schema = createSchema(arr);

      test("less count", () => {
        const valid = schema.isValidSync({ list: [1, 2] });
        expect(valid).toBeTruthy();
      });

      test("equal count", () => {
        expect(schema.isValidSync({ list: [1, 2, 3] })).toBeTruthy();
      });

      test("more count", () => {
        const valid = schema.isValidSync({ list: [1, 2, 3, 4] });
        expect(valid).toBeFalsy();
      });
    });
  });

  describe("minItems", () => {
    describe("schema opts", () => {
      test("string - ignored", () => {
        expect(() => createArr({ minItems: "2" })).not.toThrow();
      });

      test("negative - throws", () => {
        expect(() => createArr({ minItems: -1 })).toThrow();
      });
    });

    describe("validate", () => {
      const arr = createArr({ minItems: 3 });
      const schema = createSchema(arr);
      test("less count", () => {
        const valid = schema.isValidSync({ list: [1, 2] });
        expect(schema.isValidSync({ list: [1, 2] })).toBeFalsy();
      });

      test("equal count", () => {
        expect(schema.isValidSync({ list: [1, 2, 3] })).toBeTruthy();
      });

      test("more count", () => {
        expect(schema.isValidSync({ list: [1, 2, 3, 4] })).toBeTruthy();
      });
    });
  });

  describe("itemsOf", () => {
    describe("schema opts", () => {
      test("type: number - ok", () => {
        expect(() => createArr({ itemsOf: { type: "number" } })).not.toThrow();
        try {
          createArr({ itemsOf: { type: "number" } });
        } catch (ex) {
          console.error(ex);
        }
      });

      test("negative - throws", () => {
        expect(() => createArr({ itemsOf: -1 })).toThrow();
      });
    });

    describe("manual simple validate", () => {
      const constraint = yup.number().min(2);
      const schema = yup.array().of(constraint);

      test("valid", () => {
        const valid = schema.isValidSync([2, 3]); //=> true
        expect(valid).toBeTruthy();
      });
      test("invalid", () => {
        const valid = schema.isValidSync([1, -24]); //=> false
        expect(valid).toBeFalsy();
      });
    });

    describe("manual schema validate", () => {
      const constraint = yup.number().min(2);

      const schema = yup.object().shape({
        list: yup.array().of(constraint),
      });

      test("valid", () => {
        const valid = schema.isValidSync({ list: [4, 2] }); //=> true
        expect(valid).toBeTruthy();
      });
      test("invalid", () => {
        const valid = schema.isValidSync({ list: [1, 2] }); //=> false
        expect(valid).toBeFalsy();
      });
    });

    describe("validate", () => {
      const arr = createArr({ itemsOf: { type: "number", min: 2 } });
      const schema = createSchema(arr);

      test("valid", () => {
        const valid = schema.isValidSync({ list: [2, 3] });
        expect(valid).toBeTruthy();
      });

      test("invalid", () => {
        const valid = schema.isValidSync({ list: [1, "yb", {}] });
        expect(valid).toBeFalsy();
      });
    });
  });
});
