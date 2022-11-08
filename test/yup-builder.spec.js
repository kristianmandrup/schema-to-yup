const { buildYup } = require("../src");

describe("buildYup", () => {
  describe("type: 'array'", () => {
    const innerSchema = {
      properties: {
        testArray: {
          type: "array",
          min: 1,
          max: 3,
          items: {
            type: "number",
          },
        },
      },
      type: "object",
    };

    let testSchema, config, schema;
    beforeEach(() => {
      testSchema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "test_id",
        title: "array",
        type: "object",
        ...innerSchema,
      };

      config = {
        // logging: true,
      };
      schema = buildYup(testSchema, config);
    });

    test("validates array", () => {
      expect(() => {
        schema.validateSync({ testArray: [] });
      }).toThrow();
      expect(() => {
        schema.validateSync({ testArray: [1, 2, 3, 4] });
      }).toThrow();
      expect(() => {
        schema.validateSync({ testArray: [1, "a"] });
      }).toThrow();
      expect(() => {
        schema.validateSync({ testArray: [1, 2] });
      }).not.toThrow();
    });
  });
});
