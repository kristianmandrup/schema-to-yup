import { createRefValidator } from "../../lib/reference/ref-validator";

const reference = "#/definitions/car";
const config = {};

describe("validateRef", () => {
  // IRefValidator
  const validator: any = createRefValidator(config);
  describe("missing reference", () => {
    test("is invalid", () => {
      expect(() => validator.validate()).toThrow();
    });
  });

  describe("invalid reference", () => {
    test("is invalid", () => {
      expect(() => validator.validate({})).toThrow();
    });
  });

  describe("valid reference", () => {
    test("is valid", () => {
      const valid = validator.validate(reference);
      expect(valid).toEqual(true);
    });
  });
});
