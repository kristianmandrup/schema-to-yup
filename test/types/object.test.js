const { types, buildYup } = require("../../src");
const { createObjectHandler } = require("../../src/types/object");
const { toYupObject } = types;
const yup = require("yup");

const isObject = fieldDef => fieldDef && fieldDef.type === "object";
const config = { isObject };

const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupObject(obj, config);
};

const createObject = value => {
  const obj = { value, config, key: "x", type: "object" };
  return toYupObject(obj, config);
};

const createObjectNoKey = value => {
  const obj = { value, config, type: "object" };
  return toYupObject(obj, config);
};

describe("toYupObject", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createObject({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createObjectNoKey({})).toThrow();
  });
});

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
        const dogSchema = {
          type: "object",
          title: "Dog",
          properties: {
            name: {
              type: "string"
            },
            age: {
              type: "number"
            }
          }
        };

        const schema = {
          type: "object",
          title: "Person",
          properties: {
            name: {
              type: "string"
            },
            dog: dogSchema
          },
          required: ["name"]
        };
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
