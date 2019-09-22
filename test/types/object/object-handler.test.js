import { createObjectHandler, schema, dogSchema, buildYup } from "./_helpers";

describe("ObjectHandler", () => {
  describe("createObjectHandler", () => {
    describe("config object - null", () => {
      test("creates using empty config", () => {
        expect(createObjectHandler(null)).toBeTruthy();
      });
    });

    describe("config object", () => {
      test("creates using config", () => {
        expect(createObjectHandler({ x: 2 })).toBeTruthy();
      });
    });
  });

  describe("instance", () => {
    describe("handle", () => {
      describe.only("recursive object schema", () => {
        const instance = createObjectHandler({ schema, buildYup });
        const obj = {
          key: "dog",
          type: "object",
          schema,
          value: dogSchema
        };
        const dogYupSchema = instance.handle(obj);

        const dog = {
          valid: {
            name: "Spot",
            age: 1
          },
          invalid: {
            age: "x"
          }
        };

        test("valid dog", () => {
          const valid = dogYupSchema.isValidSync(dog.valid);
          expect(valid).toBeTruthy();
        });

        test("invalid dog", () => {
          const valid = dogYupSchema.isValidSync(dog.invalid);
          expect(valid).toBeFalsy();
        });
      });
    });
  });
});
