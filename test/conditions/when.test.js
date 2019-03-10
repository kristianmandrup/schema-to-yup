const { createWhenCondition } = require("../../src/conditions");
const { createYupSchemaEntry } = require("../../src/create-entry");
import defaults from "../../src/types/defaults";
import * as yup from "yup";

function expectYupSchemaEntry(obj) {
  expect(obj.tests).toBeDefined();
}

describe("when", () => {
  describe("then", () => {
    const schema = {
      title: "user",
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        age: {
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
    const ageObj = properties.age;

    const config = {
      createYupSchemaEntry,
      ...defaults["json-schema"]
    };

    const type = "number";
    const key = "age";

    // console.log({ config });

    const whenCondition = createWhenCondition({
      schema,
      properties,
      type,
      key,
      value: ageObj,
      when: ageObj.when,
      config
    });

    describe("validateAndConfigure", () => {
      test("not object - false", () => {
        const when = "hello";

        const v = whenCondition.validateAndConfigure(when);
        expect(v).toBe(false);
      });
      test("empty object - false", () => {
        const when = {};

        const v = whenCondition.validateAndConfigure(when);
        expect(v).toBe(false);
      });

      test("object single is key - false", () => {
        const when = {
          is: true
        };

        const v = whenCondition.validateAndConfigure(when);
        expect(v).toBe(false);
      });

      test("object single is and then keys - true", () => {
        const when = {
          is: true,
          then: "required"
        };

        const v = whenCondition.validateAndConfigure(when);
        expect(v).toBe(true);
      });
    });

    describe("createValue", () => {
      test("then: required - defined", () => {
        const whenKey = "then";
        const thenDef = "required";
        const value = whenCondition.createValue(thenDef, whenKey);
        expect(value.required).toBe(true);
        expect(value.type).toEqual(type);
        expect(value.key).toEqual(key);
      });

      test("then: required: true - defined", () => {
        const whenKey = "then";
        const thenDef = {
          required: true
        };
        const value = whenCondition.createValue(thenDef, whenKey);
        expect(value.required).toBe(true);
        expect(value.type).toEqual(type);
        expect(value.key).toEqual(key);
      });
    });

    describe("createEntryOpts", () => {
      test("then: required - defined", () => {
        const whenKey = "then";
        const entryObj = "required";
        const opts = whenCondition.createEntryOpts(entryObj, whenKey);
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
        const entry = whenCondition.whenEntryFor(entryObj, "then");
        expect(entry).toBeDefined();
      });
    });

    describe("whenEntryFor", () => {
      test("no whenObj - throws", () => {
        expect(() => whenCondition.whenEntryFor(null, "then")).toThrow();
      });

      test("no then - unmodified", () => {
        let whenObj = {};
        const schemaEntry = whenCondition.whenEntryFor(whenObj, "then");
        expect(schemaEntry).toBe(whenObj);
      });

      test("then: required - unmodified", () => {
        let whenObj = {
          then: "required"
        };
        const schemaEntry = whenCondition.whenEntryFor(whenObj, "then");
        expect(schemaEntry).toBeDefined();
      });

      test("min: 2 - defined", () => {
        let whenObj = {
          then: {
            min: 2
          }
        };
        const schemaEntry = whenCondition.whenEntryFor(whenObj, "then");
        expectYupSchemaEntry(schemaEntry);
      });
    });

    describe("checkIs", () => {
      test("true, present - true", () => {
        const check = whenCondition.checkIs(true, true);
        expect(check).toBe(true);
      });

      test("false, present - false", () => {
        const check = whenCondition.checkIs(false, true);
        expect(check).toBe(false);
      });
    });

    describe("accumulate", () => {
      test("name", () => {
        const acc = {};
        const newAcc = whenCondition.accumulate(acc, "name");
        expect(newAcc).not.toEqual(acc);
      });
    });

    describe("get constraintObj", () => {
      test("no keys - empty", () => {
        whenCondition.whenKeys = undefined;
        const result = whenCondition.constraintObj;
        expect(result).toEqual({});
      });

      test("has keys - not empty", () => {
        whenCondition.whenKeys = ["name"];
        const result = whenCondition.constraintObj;
        expect(result).not.toEqual({});
      });
    });

    describe("get keyVal", () => {
      test("single key - string", () => {
        whenCondition.whenKeys = ["name"];
        const result = whenCondition.keyVal;
        expect(result).toEqual("name");
      });

      test("multiple keys - array", () => {
        const keys = ["name", "age"];
        whenCondition.whenKeys = keys;
        const result = whenCondition.keyVal;
        expect(result).toEqual(keys);
      });
    });

    test("constraintValue", () => {
      const { constraintValue } = whenCondition;
      expect(constraintValue).toBeDefined();
    });

    test("constraint", () => {
      const { constraint } = whenCondition;
      expect(constraint).toBeDefined();
    });
  });

  describe("manual setup", () => {
    var inst = yup.object({
      isBig: yup.boolean(),
      count: yup.number().when("isBig", {
        is: true,
        then: yup.number().min(5),
        otherwise: yup.number().min(0)
      })
    });

    test("validate", () => {
      const result = inst.validate({
        isBig: true,
        count: 10
      });
      expect(result).toBe(true);
    });
  });

  describe("use WhenCondition", () => {
    const { constraint } = whenCondition;
    const count = yup.number().when(constraint);

    var inst = yup.object({
      isBig: yup.boolean(),
      count
    });

    test("validate", () => {
      const result = inst.validate({
        isBig: true,
        count: 10
      });
      expect(result).toBe(true);
    });
  });
});
