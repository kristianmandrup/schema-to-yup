import { schema, buildYup } from "./_helpers";

describe("complex nested object schema", () => {
  const complexJson = {
    valid: {
      name: "Kris",
      dog: {
        name: "Spot"
      }
    },
    invalid: {
      name: "Mike",
      dog: {
        name: 1
      }
    }
  };

  const yupSchema = buildYup(schema);

  describe("valid json", () => {
    const valid = yupSchema.isValidSync(complexJson.valid);

    it("is valid", () => {
      expect(valid).toBe(true);
    });
  });

  describe("invalid json", () => {
    const valid = yupSchema.isValidSync(complexJson.invalid);

    it("is invalid", () => {
      expect(valid).toBe(false);
    });
  });
});
