const { createWhenCondition } = require("../../src/conditions");

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

    const whenCondition = createWhenCondition({
      schema,
      properties,
      key: "age",
      value: ageObj,
      when: ageObj.when
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
        expect(v).toBe(true);
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

    describe("whenEntryFor", () => {
      test("true, present - true", () => {
        let whenObj = {
          min: 2
        };
        const modfWhenObj = whenCondition.whenEntryFor(whenObj, "then");
        expect(modfWhenObj.then).toBeDefined();
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

    test("constraintValue", () => {
      const { constraintValue } = whenCondition;
      expect(constraintValue).toBeDefined();
    });

    test("constraint", () => {
      const { constraint } = whenCondition;
      expect(constraint).toBeDefined();
    });
  });
});
