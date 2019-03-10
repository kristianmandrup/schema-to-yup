const { buildYup } = require("..");

describe("when", () => {
  const createTester = schema => {
    return (json, expectedResult) => {
      const valid = schema.isValidSync(json);
      console.log({ json, valid, expectedResult });
      expect(valid).toBe(expectedResult);
    };
  };

  describe("then", () => {
    const whenThenjson = {
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

    const json = {
      valid: {
        name: "mike",
        age: 32
      },
      invalid: {
        name: "mike"
      }
    };

    const yupSchema = buildYup(whenThenjson);
    const tester = createTester(yupSchema);

    test.skip("valid", () => {
      tester(json.valid, true);
    });

    test.only("invalid", () => {
      tester(json.invalid, false);
    });
  });
});
