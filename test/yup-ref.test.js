const innerSchema = {
  required: ["startDate", "endDate"],
  properties: {
    startDate: {
      type: "number",
    },
    endDate: {
      type: "number",
      min: "startDate",
    },
  },
  type: "object",
};

const { buildYup } = require("../src");

describe("Date schema for yup.ref", () => {
  let dateSchema, config, schema;
  beforeEach(() => {
    dateSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/login.schema.json",
      title: "Date",
      description: "Date form",
      type: "object",
      ...innerSchema,
    };

    config = {
      // logging: true,
    };
    schema = buildYup(dateSchema, config);
  });

  it("is invalid with invalid data", async () => {
    try {
      const valid = await schema.isValid({ startDate: 10, endDate: 5 });
      expect(valid).toBe(false);
    } catch (e) {
      // console.log(e);
    }
  });

  it("is valid with valid data", async () => {
    try {
      const valid = await schema.isValid({ startDate: 10, endDate: 15 });
      expect(valid).toBe(true);
    } catch (e) {
      // console.log(e);
    }
  });
});
