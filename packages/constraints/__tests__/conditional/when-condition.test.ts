import { createWhenCondition } from "../../lib/conditional/when-condition";
import { createSchemaEntry } from "../../lib/create-entry";
import { inquiry } from "@schema-validator/core";
const defaults = inquiry;
import * as yup from "yup";

function expectYupSchemaEntry(obj) {
  expect(obj.tests).toBeDefined();
}

describe("WhenCondition", () => {
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
    createSchemaEntry,
    ...defaults["json-schema"]
  };

  const type = "number";
  const key = "age";

  // console.log({ config });

  const whenCondition: any = createWhenCondition({
    schema,
    properties,
    type,
    key,
    value: ageObj,
    when: ageObj.when,
    config
  });

  describe("then", () => {
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

      test("object single key - true", () => {
        const when = {
          name: {
            is: true
          }
        };

        const v = whenCondition.validateAndConfigure(when);
        expect(v).toBe(true);
      });
    });

    describe("accumulate", () => {
      test("name", () => {
        const acc = {};

        whenCondition.validateAndConfigure();

        // should be an object with keys 'is' and 'then' minimum
        console.log({ when: whenCondition.when });

        const newAcc = whenCondition.accumulate(acc, "name");
        expect(newAcc).not.toEqual({});
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

  // Yup mixed.when:
  // https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

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
      // Runs validatations synchronously if possible and returns the resulting value, or throws a ValidationError.
      // https://github.com/jquense/yup#mixedvalidatesyncvalue-any-options-object-any
      const value = {
        isBig: true,
        count: 10
      };
      const result = inst.validateSync(value);

      // console.log({ result });

      expect(result).toEqual(value);
    });
  });

  describe("use WhenCondition", () => {
    const { constraint } = whenCondition;

    // console.log({ constraint });

    const count = yup.number().when(...constraint);

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

      // console.log({ result });

      expect(result).toEqual(value);
    });
  });
});
