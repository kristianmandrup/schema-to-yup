import * as yup from "yup";
import { createWhenCondition } from "./custom-when";
const { buildYup } = require("../src");

const createValidTester = (schema) => {
  return (json, expectedResult) => {
    const valid = schema.isValidSync(json);
    expect(valid).toBe(expectedResult);
  };
};

describe("when", () => {
  const bigJson = {
    valid: {
      isBig: true,
      count: 5,
    },
    invalid: {
      isBig: true,
      count: 4,
    },
  };

  describe.skip("manual then", () => {
    describe("simple", () => {
      const yupSchema = yup.object({
        isBig: yup.boolean(),
        count: yup.number().when("isBig", {
          is: true, // alternatively: (val) => val == true
          then: yup.number().min(5),
        }),
      });

      const tester = createValidTester(yupSchema);

      test("valid", () => {
        tester(bigJson.valid, true);
      });

      test("invalid", () => {
        tester(bigJson.invalid, false);
      });
    });
  });

  describe.skip("isBig", () => {
    const biggyjson = {
      title: "biggy",
      type: "object",
      properties: {
        isBig: {
          type: "boolean",
        },
        count: {
          type: "number",
          when: {
            isBig: {
              is: true,
              then: {
                min: 5,
              },
            },
          },
        },
      },
    };

    const yupSchema = buildYup(biggyjson);
    const tester = createValidTester(yupSchema);

    test("valid", () => {
      tester(bigJson.valid, true);
    });

    test("invalid", () => {
      tester(bigJson.invalid, false);
    });
  });

  describe.skip("should work with legacy when method", () => {
    const biggyjson = {
      title: "biggy",
      type: "object",
      properties: {
        isBig: {
          type: "boolean",
        },
        count: {
          type: "number",
          when: {
            isBig: {
              is: true,
              then: {
                min: 5,
              },
            },
          },
        },
      },
    };

    const yupSchema = buildYup(biggyjson, { createWhenCondition });
    const tester = createValidTester(yupSchema);

    test("valid", () => {
      tester(bigJson.valid, true);
    });

    test("invalid", () => {
      tester(bigJson.invalid, false);
    });
  });

  describe("nameCountjson", () => {
    const nameCountjson = {
      title: "user",
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
          when: {
            name: {
              is: true,
              then: "required",
            },
          },
        },
      },
    };

    const json = {
      valid: {
        name: "mike",
        age: 32,
      },
      invalid: {
        name: "mike",
      },
    };

    const yupSchema = buildYup(nameCountjson);
    const tester = createValidTester(yupSchema);

    test("valid", () => {
      tester(json.valid, true);
    });

    test.skip("invalid", () => {
      tester(json.invalid, false);
    });
  });
});
