const { createWhenCondition } = require("../../src/conditions");
const { createYupSchemaEntry } = require("../../src/create-entry");
import defaults from "../../src/types/defaults";
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
            then: "required",
            otherwise: {
              min: 3 // min length of name
            }
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

  const whenCondition = createWhenCondition({
    schema,
    properties,
    type,
    key,
    value: ageObj,
    when: ageObj.when,
    config
  });

  describe("when: then-otherwise", () => {
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

  describe.skip("manual setup", () => {
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
      expect(result).toEqual(value);
    });
  });

  describe("use WhenCondition", () => {
    const { constraint } = whenCondition;
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

      try {
        const result = inst.validateSync(value);
        expect(result).toEqual(value);
      } catch (ex) {
        console.log("validate", { ex });
      }
    });
  });
});
