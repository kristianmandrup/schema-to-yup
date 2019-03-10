const { buildYup } = require("../");

describe("when", () => {
  const createTester = schema => {
    return (json, expectedResult) => {
      const valid = schema.isValidSync(json);
      console.log({ json, valid, expectedResult });
      expect(valid).toBe(expectedResult);
    };
  };

  describe("then otherwise", () => {
    const whenThenOtherwisejson = {
      title: "user",
      type: "object",
      properties: {
        isBig: {
          type: "string",
          min: 1
        },
        level: {
          type: "number",
          required: true,
          when: {
            isBig: {
              is: true,
              then: {
                min: 2
              },
              otherwise: {
                min: 10
              }
            }
          }
        }
      }
    };

    const $json = {
      isBig: {
        valid: {
          isBig: "x",
          level: 3
        },
        invalid: {
          isBig: "x",
          level: 0
        }
      },
      isNotBig: {
        isBig: "",
        age: 3
      },
      invalid: {
        isBig: "",
        level: 0
      }
    };

    const yupSchema = buildYup(whenThenOtherwisejson);
    const tester = createTester(yupSchema);

    describe("isBig", () => {
      const json = $json.isBig;
      test("valid", () => {
        tester(json.valid, true);
      });

      test("valid", () => {
        tester(json.invalid, false);
      });
    });

    describe("isNotBig", () => {
      const json = $json.isNotBig;
      test("valid", () => {
        tester(json.valid, true);
      });

      test("valid", () => {
        tester(json.invalid, false);
      });
    });
  });
});
