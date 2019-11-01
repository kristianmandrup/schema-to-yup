import { schema, buildYup } from "./_helpers";

describe("complex nested object schema", () => {
  const complexJson = {
    valid: {
      name: "Kris",
      dog: {
        name: "Spot",
        age: 7
      },
      pets: [
        {
          name: 'Harpua',
          age: 12
        }
      ]
    },
    invalid: {
      name: "Mike",
      dog: {
        name: 1
      }
    }
  };

  const yupSchema = buildYup(schema);
  // console.log({ yupSchema });

  describe("valid json", () => {
    const obj = complexJson.valid;
    const valid = yupSchema.isValidSync(complexJson.valid);
    yupSchema.validate(obj).catch(err => console.log(err));

    it("is valid", () => {
      expect(valid).toBe(true);
    });
  });

  describe("invalid json", () => {
    const obj = complexJson.invalid;
    const valid = yupSchema.isValidSync(obj);
    yupSchema.validate(obj).catch(err => console.log(err));

    it("is invalid", () => {
      expect(valid).toBe(false);
    });
  });
});
