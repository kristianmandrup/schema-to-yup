import { createSchemaValidator } from "./schema-validator";

const schema = {
  definitions: {
    car: {
      type: "object",
      name: "superCar",
      properties: {}
    }
  }
};

describe("validateSchema", () => {
  const validator = createSchemaValidator();

  describe("missing schema", () => {
    test("is invalid", () => {
      expect(() => validator.validate()).toThrow();
    });
  });

  describe("bad schema", () => {
    test("is invalid", () => {
      expect(() => validator.validate("x")).toThrow();
    });
  });

  describe("valid schema", () => {
    test("is valid", () => {
      expect(() => validator.validate(schema)).not.toThrow();
    });
  });
});
