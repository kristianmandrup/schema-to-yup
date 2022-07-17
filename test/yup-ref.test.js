const { buildYup } = require("../src");

describe("Date schema for yup.ref", () => {
  const innerSchema = {
    required: ["startDate", "endDate"],
    properties: {
      startDate: {
        type: "date",
      },
      endDate: {
        type: "date",
        min: "startDate",
      },
    },
    type: "object",
  };
  

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

describe("Number schema for yup.ref", () => {
  const innerSchema = {
    required: ["startLevel", "endLevel"],
    properties: {
      startLevel: {
        type: "number",
      },
      endLevel: {
        type: "number",
        min: "startLevel",
      },
    },
    type: "object",
  };
  

  let numberSchema, config, schema;
  beforeEach(() => {
    numberSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/login.schema.json",
      title: "Number",
      description: "Number form",
      type: "object",
      ...innerSchema,
    };

    config = {
      // logging: true,
    };
    numberSchema = buildYup(numberSchema, config);
  });

  it("is invalid with invalid data", async () => {
    try {
      const valid = await schema.isValid({ startLevel: 10, endLevel: 5 });
      expect(valid).toBe(false);
    } catch (e) {
      // console.log(e);
    }
  });

  it("is valid with valid data", async () => {
    try {
      const valid = await schema.isValid({ startLevel: 10, endLevel: 15 });
      expect(valid).toBe(true);
    } catch (e) {
      // console.log(e);
    }
  });
});

describe("String schema for yup.ref", () => {
  const innerSchema = {
    required: ["summary", "full"],
    properties: {
      startLevel: {
        type: "string",
      },
      endLevel: {
        type: "string",
        min: "summary",
      },
    },
    type: "object",
  };
  

  let numberSchema, config, schema;
  beforeEach(() => {
    numberSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/login.schema.json",
      title: "Number",
      description: "Number form",
      type: "object",
      ...innerSchema,
    };

    config = {
      // logging: true,
    };
    numberSchema = buildYup(numberSchema, config);
  });

  it("is invalid with invalid data", async () => {
    try {
      const valid = await schema.isValid({ summary: "there once was a dog a bird and a cat", full: "there once was a dog" });
      expect(valid).toBe(false);
    } catch (e) {
      // console.log(e);
    }
  });

  it("is valid with valid data", async () => {
    try {
      const valid = await schema.isValid({ summary: "there once was a", full: "there once was a dog and a cat" });
      expect(valid).toBe(true);
    } catch (e) {
      // console.log(e);
    }
  });
});
