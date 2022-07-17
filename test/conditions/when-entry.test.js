const { createWhenEntry } = require("../../src/conditions/when/when-entry");

const { createYupSchemaEntry } = require("../../src/create-entry");
import schemaParserMaps from "../../src/types/schema-parser-maps";
import * as yup from "yup";

function expectYupSchemaEntry(obj) {
  // expect(obj.is).toBeDefined();
  expect(obj.then.tests).toBeDefined();
}

describe("WhenEntry", () => {
  const schema = {
    title: "user",
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      count: {
        type: "number",
        when: {
          name: {
            is: true,
            then: "required"
          }
        }
      }
    }
  };

  const properties = schema.properties;
  const countObj = properties.count;

  const config = {
    createYupSchemaEntry,
    ...schemaParserMaps["json-schema"]
  };

  const type = "number";
  const key = "count";
  const keys = Object.keys(countObj.when);

  const whenObj = {
    schema,
    properties,
    type,
    key,
    // keys,
    value: countObj,
    when: countObj.when,
    config
  };

  const whenEntryObj = {
    key: "count",
    is: true,
    then: "required"
  };

  const whenEntry = createWhenEntry(whenEntryObj, whenObj);

  describe("then", () => {
    describe("validateAndConfigure", () => {
      test("not object - false", () => {
        const when = "hello";

        const v = whenEntry.validateAndConfigure(when);
        expect(v).toBe(false);
      });
      test("empty object - false", () => {
        const when = {};

        const v = whenEntry.validateAndConfigure(when);
        expect(v).toBe(false);
      });

      test("object single is key - false", () => {
        const when = {
          is: true
        };

        const v = whenEntry.validateAndConfigure(when);
        expect(v).toBe(false);
      });

      test("object single is and then keys - true", () => {
        const when = {
          is: true,
          then: "required"
        };

        const v = whenEntry.validateAndConfigure(when);
        expect(v).toBe(true);
      });
    });

    describe("createValue", () => {
      test("then: required - defined", () => {
        const whenKey = "then";
        const thenDef = "required";
        const value = whenEntry.createValue(thenDef, whenKey);
        expect(value.required).toBe(true);
        expect(value.type).toEqual(type);
        expect(value.key).toEqual(key);
      });

      test("then: required: true - defined", () => {
        const whenKey = "then";
        const thenDef = {
          required: true
        };
        const value = whenEntry.createValue(thenDef, whenKey);
        expect(value.required).toBe(true);
        expect(value.type).toEqual(type);
        expect(value.key).toEqual(key);
      });
    });

    describe("createEntryOpts", () => {
      test("then: required - defined", () => {
        const whenKey = "then";
        const entryObj = "required";
        const opts = whenEntry.createEntryOpts(entryObj, whenKey);
        expect(opts).toBeDefined();
        expect(opts.type).toEqual(type);
        expect(opts.key).toEqual(key);
        expect(opts.properties).toEqual(properties);
        expect(opts.value.required).toBe(true);
      });
    });

    describe("createEntry", () => {
      test("then: required - defined", () => {
        let entryObj = "required";
        const entry = whenEntry.whenEntryFor(entryObj, "then");
        expect(entry).toBeDefined();
      });
    });

    describe("whenEntryFor", () => {
      test("no whenObj - throws", () => {
        expect(() => whenEntry.whenEntryFor(null, "then")).toThrow();
      });

      test("no then - unmodified", () => {
        let whenObj = {};
        const schemaEntry = whenEntry.whenEntryFor(whenObj, "then");
        expect(schemaEntry).not.toEqual({});
      });

      test("then: required - unmodified", () => {
        let whenObj = {
          then: "required"
        };
        const schemaEntry = whenEntry.whenEntryFor(whenObj, "then");
        expect(schemaEntry).toBeDefined();
      });

      test("min: 2 - defined", () => {
        let whenObj = {
          then: {
            min: 2
          }
        };
        const schemaEntry = whenEntry.whenEntryFor(whenObj, "then");
        expectYupSchemaEntry(schemaEntry);
      });
    });
  });

  describe("calcEntryObj", () => {
    test("missing is constraint - unmodified", () => {
      whenEntry.whenEntryObj.is = undefined;
      const result = whenEntry.calcEntryObj();
      const expected = whenEntry.whenEntryObj;
      expect(result).not.toEqual(expected);
    });
  });

  describe("get entryObj", () => {
    test("not valid - false", () => {
      whenEntry.whenEntryObj = {};
      const entry = whenEntry.entryObj;
      expect(entry).toBe(false);
    });
  });

  // Yup mixed.when:
  // https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

  describe.skip("manual setup", () => {
    const whenObj = {
      is: true,
      then: yup.number().min(5)
    };

    var inst = yup.object({
      isBig: yup.boolean(),
      count: yup.number().when("isBig", whenObj)
    });

    test("validate", () => {
      // Runs validatations synchronously if possible and returns the resulting value, or throws a ValidationError.
      // https://github.com/jquense/yup#mixedvalidatesyncvalue-any-options-object-any
      const value = {
        isBig: true,
        count: 10
      };
      const result = inst.validateSync(value);

      expect(result).toEqual(value);
    });
  });

  describe("use WhenEntry", () => {
    const entry = createWhenEntry(
      {
        is: true,
        then: {
          min: 5
        }
      },
      {
        key: "count",
        type: "number",
        schema,
        keys: ["name", "count"],
        properties,
        config
      }
    );

    const { entryObj } = entry;
    const count = yup.number().when("isBig", entryObj);

    var inst = yup.object({
      isBig: yup.boolean(),
      count
    });

    test("validate", () => {
      // Runs validatations synchronously if possible and returns the resulting value, or throws a ValidationError.
      // https://github.com/jquense/yup#mixedvalidatesyncvalue-any-options-object-any
      const value = {
        isBig: true,
        count: 10
      };
      const result = inst.validateSync(value);

      expect(result).toEqual(value);
    });
  });
});
